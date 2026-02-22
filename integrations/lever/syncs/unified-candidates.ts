import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches opportunities from Lever and maps them to the standard ATS candidate model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/candidates/unified',
            group: 'Unified ATS API'
        }
    ],

    scopes: ['opportunities:read:admin'],

    models: {
        StandardCandidate: StandardCandidate
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const batch of nango.paginate({
            // https://hire.lever.co/developer/documentation#list-all-opportunities
            endpoint: '/v1/opportunities',
            params: {
                ...(nango.lastSyncDate && { created_at_start: nango.lastSyncDate.getTime() })
            },
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
            if (batch.length > 0) {
                await nango.batchSave(batch.map(toStandardCandidate), 'StandardCandidate');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
