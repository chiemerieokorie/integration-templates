import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { toAtsApplication } from '../mappers/to-ats-application.js';
import { AtsApplication } from '../../shared/models/ats/ats-application.js';

const LIMIT = 100;

const sync = createSync({
    description: 'Fetches job candidates from Workable and maps them to the standard ATS application model',
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

    scopes: ['r_jobs'],

    models: {
        AtsApplication: AtsApplication
    },

    exec: async (nango) => {
        const jobs: any[] = await getAllJobs(nango);

        for (const job of jobs) {
            const config: ProxyConfiguration = {
                // https://workable.readme.io/reference/job-candidates-index
                endpoint: `/spi/v3/jobs/${job.shortcode}/candidates`,
                paginate: {
                    type: 'link',
                    link_path_in_response_body: 'paging.next',
                    limit_name_in_request: 'limit',
                    response_path: 'candidates',
                    limit: LIMIT
                },
                retries: 3
            };
            for await (const candidates of nango.paginate(config)) {
                if (candidates.length > 0) {
                    await nango.batchSave(candidates.map(toAtsApplication), 'AtsApplication');
                }
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('AtsApplication');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;

async function getAllJobs(nango: NangoSyncLocal) {
    const records: any[] = [];
    for await (const batch of nango.paginate({
        // https://workable.readme.io/reference/jobs
        endpoint: '/spi/v3/jobs',
        paginate: {
            type: 'link',
            link_path_in_response_body: 'paging.next',
            limit_name_in_request: 'limit',
            response_path: 'jobs',
            limit: LIMIT
        },
        retries: 3
    })) {
        records.push(...batch);
    }
    return records;
}
