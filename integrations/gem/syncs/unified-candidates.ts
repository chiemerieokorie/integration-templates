import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';
import type { GemCandidate } from '../types.js';

const sync = createSync({
    description: 'Fetches candidates from Gem and maps them to the standard ATS candidate model',
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

    exec: async (nango) => {
        for await (const batch of nango.paginate<GemCandidate>({
            // https://api.gem.com/ats/v0/reference#tag/Candidate/paths/~1ats~1v0~1candidates~1/get
            endpoint: '/ats/v0/candidates',
            params: {
                include_deleted: 'true',
                ...(nango.lastSyncDate && { updated_after: nango.lastSyncDate.toISOString() })
            },
            paginate: {
                type: 'offset',
                offset_name_in_request: 'page',
                offset_start_value: 1,
                limit_name_in_request: 'per_page',
                limit: 100
            },
            retries: 3
        })) {
            const active = batch.filter((c) => !c.deleted_at);
            const deleted = batch.filter((c) => c.deleted_at);

            if (deleted.length > 0) {
                await nango.batchDelete(deleted.map(toStandardCandidate), 'StandardCandidate');
            }
            if (active.length > 0) {
                await nango.batchSave(active.map(toStandardCandidate), 'StandardCandidate');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
