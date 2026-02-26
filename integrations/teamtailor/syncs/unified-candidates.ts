import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';

const sync = createSync({
    description: 'Fetches candidates from TeamTailor and maps them to the standard ATS candidate model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'full',

    endpoints: [
        {
            method: 'GET',
            path: '/candidates/unified',
            group: 'Unified ATS API'
        }
    ],

    scopes: ['Admin'],

    models: {
        StandardCandidate: StandardCandidate
    },

    exec: async (nango) => {
        for await (const batch of nango.paginate({
            // https://docs.teamtailor.com/#759f6a0c-5b05-4d9c-b1c8-af80c5d9b620
            endpoint: '/v1/candidates',
            paginate: {
                type: 'link',
                link_path_in_response_body: 'links.next',
                limit_name_in_request: 'page[size]',
                response_path: 'data',
                limit: 30
            },
            retries: 3
        })) {
            if (batch.length > 0) {
                await nango.batchSave(batch.map(toStandardCandidate), 'StandardCandidate');
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('StandardCandidate');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
