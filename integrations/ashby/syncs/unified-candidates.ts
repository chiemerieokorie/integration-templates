import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches candidates from Ashby and maps them to the standard ATS candidate model',
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

    models: {
        StandardCandidate: StandardCandidate
    },

    metadata: z.object({}),

    exec: async (nango) => {
        let cursor: string | undefined;

        // eslint-disable-next-line @nangohq/custom-integrations-linting/no-while-true
        while (true) {
            // https://developers.ashbyhq.com/reference/candidatelist
            const response = await nango.post({
                endpoint: '/candidate.list',
                data: {
                    limit: 100,
                    ...(cursor && { cursor })
                },
                retries: 3
            });

            const candidates = response.data.results ?? [];
            if (candidates.length > 0) {
                await nango.batchSave(candidates.map(toStandardCandidate), 'StandardCandidate');
            }

            if (response.data.moreDataAvailable) {
                cursor = response.data.nextCursor;
            } else {
                break;
            }
        }

        await nango.deleteRecordsFromPreviousExecutions('StandardCandidate');
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
