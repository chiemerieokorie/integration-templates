import { createSync } from 'nango';
import { AtsJob } from '../../shared/models/ats/ats-job.js';
import { toAtsJob } from '../mappers/to-ats-job.js';

const sync = createSync({
    description: 'Fetches jobs from Workable and maps them to the standard ATS job model',
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

    scopes: ['r_jobs'],

    models: {
        AtsJob: AtsJob
    },

    exec: async (nango) => {
        for await (const jobs of nango.paginate({
            // https://workable.readme.io/reference/jobs
            endpoint: '/spi/v3/jobs',
            paginate: {
                type: 'link',
                link_path_in_response_body: 'paging.next',
                limit_name_in_request: 'limit',
                response_path: 'jobs',
                limit: 100
            },
            ...(nango.lastSyncDate && { params: { created_after: nango.lastSyncDate.toISOString() } }),
            retries: 3
        })) {
            if (jobs.length > 0) {
                await nango.batchSave(jobs.map(toAtsJob), 'AtsJob');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
