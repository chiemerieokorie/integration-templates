import { createSync } from 'nango';
import { AtsUser } from '../../shared/models/ats/ats-user.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches members from Workable and maps them to the unified AtsUser model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/ats/users',
            group: 'Unified ATS'
        }
    ],

    scopes: ['r_jobs'],

    models: {
        AtsUser: AtsUser
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const batch of nango.paginate<any>({
            // https://workable.readme.io/reference/members
            endpoint: '/spi/v3/members',
            paginate: {
                type: 'link',
                link_path_in_response_body: 'paging.next',
                limit_name_in_request: 'limit',
                response_path: 'members',
                limit: 100
            },
            retries: 3
        })) {
            const mapped: AtsUser[] = batch.map((member: any) => ({
                id: member.id,
                name: member.name ?? null,
                email: member.email ?? null,
                role: member.role ?? null,
                isActive: true,
                providerSpecific: {
                    headline: member.headline
                }
            }));

            if (mapped.length > 0) {
                await nango.batchSave(mapped, 'AtsUser');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
