import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches candidates from Greenhouse and maps them to the standard ATS candidate model',
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

    models: {
        StandardCandidate: StandardCandidate
    },

    metadata: z.object({}),

    exec: async (nango) => {
        for await (const batch of nango.paginate({
            // https://developers.greenhouse.io/harvest.html#get-list-candidates
            endpoint: '/v1/candidates',
            params: {
                ...(nango.lastSyncDate && { created_after: nango.lastSyncDate.toISOString() })
            },
            paginate: {
                type: 'link',
                limit_name_in_request: 'per_page',
                link_rel_in_response_header: 'next',
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
