import { createSync } from 'nango';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';
import type { RecruiterFlowCandidateResponse } from '../types.js';

const sync = createSync({
    description: 'Fetches candidates from RecruiterFlow and maps them to the standard ATS candidate model',
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

    exec: async (nango) => {
        for await (const batch of nango.paginate<RecruiterFlowCandidateResponse>({
            // https://recruiterflow.com/api#/Candidate%20APIs/get_api_external_candidate_list
            endpoint: '/api/external/candidate/list',
            paginate: {
                type: 'offset',
                offset_name_in_request: 'current_page',
                limit_name_in_request: 'items_per_page',
                offset_start_value: 1,
                limit: 100,
                offset_calculation_method: 'per-page',
                response_path: ''
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
