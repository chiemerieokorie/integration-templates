import { createAction } from 'nango';
import { CreateAtsNoteInput, AtsNote } from '../../shared/models/ats/create-ats-note-input.js';

const action = createAction({
    description: 'Create a note on a candidate in Ashby using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/notes',
        group: 'Unified ATS'
    },

    input: CreateAtsNoteInput,
    output: AtsNote,

    exec: async (nango, input) => {
        if (!input.candidateId) {
            throw new nango.ActionError({ message: 'candidateId is required' });
        }
        if (!input.body) {
            throw new nango.ActionError({ message: 'body is required' });
        }

        const response = await nango.post({
            // https://developers.ashbyhq.com/reference/candidatecreatenote
            endpoint: '/candidate.createNote',
            data: {
                candidateId: input.candidateId,
                note: input.body,
                sendNotifications: input.providerSpecific?.sendNotifications ?? false
            },
            retries: 3
        });

        const result = response.data.results;

        return {
            id: result.id,
            body: result.content ?? input.body,
            createdAt: result.createdAt ?? null,
            providerSpecific: {
                author: result.author
            }
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
