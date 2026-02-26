import { createSync } from 'nango';
import { toAtsApplication } from '../mappers/to-ats-application.js';
import { AtsApplication } from '../../shared/models/ats/ats-application.js';
import type { ProxyConfiguration } from 'nango';

const LIMIT = 100;

const sync = createSync({
    description: 'Fetches applications from Lever and maps them to the standard ATS application model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/ats/applications',
            group: 'Unified ATS'
        }
    ],

    scopes: ['applications:read:admin'],

    models: {
        AtsApplication: AtsApplication
    },

    exec: async (nango) => {
        const opportunities: any[] = await getAllOpportunities(nango);

        for (const opportunity of opportunities) {
            const config: ProxyConfiguration = {
                // https://hire.lever.co/developer/documentation#list-all-applications
                endpoint: `/v1/opportunities/${opportunity.id}/applications`,
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
            for await (const applications of nango.paginate(config)) {
                if (applications.length > 0) {
                    await nango.batchSave(applications.map(toAtsApplication), 'AtsApplication');
                }
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('AtsApplication');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;

async function getAllOpportunities(nango: NangoSyncLocal) {
    const records: any[] = [];
    for await (const batch of nango.paginate({
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
        records.push(...batch);
    }
    return records;
}
