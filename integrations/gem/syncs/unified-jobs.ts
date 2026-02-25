import { createSync } from 'nango';
import type { GemJob } from '../types.js';
import { toAtsJob } from '../mappers/to-ats-job.js';
import { AtsJob } from '../../shared/models/ats/ats-job.js';

const sync = createSync({
    description: 'Fetches jobs from Gem and maps them to the standard ATS job model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/ats/jobs',
            group: 'Unified ATS'
        }
    ],

    models: {
        AtsJob: AtsJob
    },

    exec: async (nango) => {
        for await (const jobs of nango.paginate<GemJob>({
            // https://api.gem.com/ats/v0/reference#tag/Job/paths/~1ats~1v0~1jobs~1/get
            endpoint: '/ats/v0/jobs',
            paginate: {
                type: 'offset',
                offset_name_in_request: 'page',
                offset_start_value: 1,
                limit_name_in_request: 'per_page',
                limit: 100
            },
            params: {
                include_deleted: 'true',
                ...(nango.lastSyncDate && { updated_after: nango.lastSyncDate.toISOString() })
            },
            retries: 3
        })) {
            const mapped = jobs.map(toAtsJob);
            const deleted = mapped.filter((j) => (j.providerSpecific as any)?.deleted_at);
            const active = mapped.filter((j) => !(j.providerSpecific as any)?.deleted_at);

            if (deleted.length > 0) {
                await nango.batchDelete(deleted, 'AtsJob');
            }
            if (active.length > 0) {
                await nango.batchSave(active, 'AtsJob');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
