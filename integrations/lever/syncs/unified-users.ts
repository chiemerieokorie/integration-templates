import { createSync } from 'nango';
import { AtsUser } from '../../shared/models/ats/ats-user.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches users from Lever and maps them to the unified AtsUser model',
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

    scopes: ['users:read:admin'],

    models: {
        AtsUser: AtsUser
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const batch of nango.paginate<any>({
            // https://hire.lever.co/developer/documentation#list-all-users
            endpoint: '/v1/users',
            paginate: {
                type: 'cursor',
                cursor_path_in_response: 'next',
                cursor_name_in_request: 'offset',
                limit_name_in_request: 'limit',
                response_path: 'data',
                limit: 100
            },
            retries: 3
        })) {
            const mapped: AtsUser[] = batch.map((user: any) => ({
                id: user.id,
                name: user.name ?? null,
                email: user.email ?? null,
                role: user.accessRole ?? null,
                isActive: !user.deactivatedAt,
                providerSpecific: {
                    username: user.username,
                    jobTitle: user.jobTitle,
                    managerId: user.managerId,
                    createdAt: user.createdAt
                }
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
