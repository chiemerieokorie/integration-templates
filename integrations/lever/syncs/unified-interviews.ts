import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { AtsInterview } from '../../shared/models/ats/ats-interview.js';
import { z } from 'zod';

const LIMIT = 100;

const sync = createSync({
    description: 'Fetches all scheduled interviews per opportunity from Lever and maps them to the unified AtsInterview model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/ats/interviews',
            group: 'Unified ATS'
        }
    ],

    scopes: ['interviews:read:admin'],

    models: {
        AtsInterview: AtsInterview
    },

    metadata: z.object({}),

    exec: async (nango) => {
        const opportunities: any[] = [];

        for await (const batch of nango.paginate<any>({
            // https://hire.lever.co/developer/documentation#list-all-opportunities
            endpoint: '/v1/opportunities',
            paginate: {
                type: 'cursor',
                cursor_path_in_response: 'next',
                cursor_name_in_request: 'offset',
                limit_name_in_request: 'limit',
                response_path: 'data',
                limit: LIMIT
            },
            retries: 3
        })) {
            opportunities.push(...batch);
        }

        for (const opportunity of opportunities) {
            const config: ProxyConfiguration = {
                // https://hire.lever.co/developer/documentation#list-all-interviews
                endpoint: `/v1/opportunities/${opportunity.id}/interviews`,
                paginate: {
                    type: 'cursor',
                    cursor_path_in_response: 'next',
                    cursor_name_in_request: 'offset',
                    limit_name_in_request: 'limit',
                    response_path: 'data',
                    limit: LIMIT
                },
                retries: 3
            };

            for await (const batch of nango.paginate<any>(config)) {
                const mapped: AtsInterview[] = batch.map((interview: any) => {
                    const scheduledAt = interview.date ? new Date(interview.date).toISOString() : null;

                    let status: AtsInterview['status'] = 'scheduled';
                    if (interview.canceledAt) {
                        status = 'cancelled';
                    } else if (interview.date && interview.date < Date.now()) {
                        status = 'completed';
                    }

                    const interviewers = (interview.interviewers ?? []).map((iv: any) => ({
                        id: iv.id ?? null,
                        name: iv.name ?? null,
                        email: iv.email ?? null
                    }));

                    return {
                        id: interview.id,
                        candidateId: opportunity.id,
                        jobId: (opportunity.postings ?? [])[0] ?? null,
                        title: interview.subject ?? null,
                        scheduledAt,
                        durationMinutes: interview.duration ?? null,
                        location: interview.location ?? null,
                        status,
                        interviewers,
                        providerSpecific: {
                            panel: interview.panel,
                            note: interview.note,
                            timezone: interview.timezone,
                            feedbackTemplate: interview.feedbackTemplate,
                            feedbackForms: interview.feedbackForms,
                            stage: interview.stage,
                            gcalEventUrl: interview.gcalEventUrl
                        }
                    };
                });

                if (mapped.length > 0) {
                    await nango.batchSave(mapped, 'AtsInterview');
                }
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
