import { createSync } from 'nango';
import { AtsUser } from '../../shared/models/ats/ats-user.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches users from Gem and maps them to the unified AtsUser model',
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

    models: {
        AtsUser: AtsUser
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const batch of nango.paginate<{ id: string; name: string; email: string }>({
            // https://api.gem.com/v0/reference#tag/Users/paths/~1v0~1users/get
            endpoint: '/v0/users',
            paginate: {
                type: 'offset',
                offset_name_in_request: 'page',
                offset_start_value: 1,
                limit_name_in_request: 'per_page',
                limit: 100
            },
            retries: 3
        })) {
            const mapped: AtsUser[] = batch.map((user: { id: string; name: string; email: string }) => ({
                id: user.id,
                name: user.name ?? null,
                email: user.email ?? null,
                role: null,
                isActive: true,
                providerSpecific: {}
            }));

            if (mapped.length > 0) {
                await nango.batchSave(mapped, 'AtsUser');
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('AtsUser');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
