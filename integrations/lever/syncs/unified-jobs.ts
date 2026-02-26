import { createSync } from 'nango';
import { AtsJob } from '../../shared/models/ats/ats-job.js';
import { toAtsJob } from '../mappers/to-ats-job.js';

const sync = createSync({
    description: 'Fetches postings from Lever and maps them to the standard ATS job model',
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

    scopes: ['postings:read:admin'],

    models: {
        AtsJob: AtsJob
    },

    exec: async (nango) => {
        for await (const postings of nango.paginate({
            // https://hire.lever.co/developer/documentation#list-all-postings
            endpoint: '/v1/postings',
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
            if (postings.length > 0) {
                await nango.batchSave(postings.map(toAtsJob), 'AtsJob');
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('AtsJob');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
