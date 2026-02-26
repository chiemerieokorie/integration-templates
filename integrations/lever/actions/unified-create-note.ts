import { createAction } from 'nango';
import { CreateAtsNoteInput, AtsNote } from '../../shared/models/ats/create-ats-note-input.js';

const action = createAction({
    description: 'Create a note on a candidate (opportunity) in Lever using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/notes',
        group: 'Unified ATS'
    },

    input: CreateAtsNoteInput,
    output: AtsNote,
    scopes: ['notes:write:admin'],

    exec: async (nango, input) => {
        if (!input.candidateId) {
            throw new nango.ActionError({ message: 'candidateId (opportunityId) is required' });
        }
        if (!input.body) {
            throw new nango.ActionError({ message: 'body is required' });
        }

        const performAs = input.providerSpecific?.perform_as as string | undefined;
        if (!performAs) {
            throw new nango.ActionError({
                message: 'providerSpecific.perform_as is required for Lever'
            });
        }

        const response = await nango.post({
            // https://hire.lever.co/developer/documentation#create-a-note
            endpoint: `/v1/opportunities/${input.candidateId}/notes`,
            params: { perform_as: performAs },
            data: {
                value: input.body,
                secret: input.visibility === 'private'
            },
            retries: 3
        });

        const result = response.data.data;

        return {
            id: result.id,
            body: result.text ?? input.body,
            createdAt: result.createdAt ? new Date(result.createdAt).toISOString() : null,
            providerSpecific: {
                user: result.user,
                secret: result.secret,
                fields: result.fields
            }
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
