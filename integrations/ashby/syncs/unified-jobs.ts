import { createSync } from 'nango';
import { AtsJob } from '../../shared/models/ats/ats-job.js';
import { toAtsJob } from '../mappers/to-ats-job.js';

const sync = createSync({
    description: 'Fetches jobs from Ashby and maps them to the standard ATS job model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'full',

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
        let cursor: string | undefined;

        // eslint-disable-next-line @nangohq/custom-integrations-linting/no-while-true
        while (true) {
            // https://developers.ashbyhq.com/reference/joblist
            const response = await nango.post({
                endpoint: '/job.list',
                data: {
                    limit: 100,
                    ...(cursor && { cursor })
                },
                retries: 3
            });

            const jobs = response.data.results ?? [];
            if (jobs.length > 0) {
                await nango.batchSave(jobs.map(toAtsJob), 'AtsJob');
            }

            if (response.data.moreDataAvailable) {
                cursor = response.data.nextCursor;
            } else {
                break;
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('AtsJob');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
