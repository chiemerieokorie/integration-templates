import { createAction } from 'nango';
import { CreateAtsNoteInput, AtsNote } from '../../shared/models/ats/create-ats-note-input.js';

const action = createAction({
    description: 'Create a comment on a candidate in Workable using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/notes',
        group: 'Unified ATS'
    },

    input: CreateAtsNoteInput,
    output: AtsNote,
    scopes: ['w_candidates'],

    exec: async (nango, input) => {
        if (!input.candidateId) {
            throw new nango.ActionError({ message: 'candidateId is required' });
        }
        if (!input.body) {
            throw new nango.ActionError({ message: 'body is required' });
        }

        const memberId = input.providerSpecific?.member_id as string | undefined;
        if (!memberId) {
            throw new nango.ActionError({
                message: 'providerSpecific.member_id is required for Workable'
            });
        }

        const policy = input.visibility === 'private' ? ['recruiter'] : undefined;

        const response = await nango.post({
            // https://workable.readme.io/reference/create-a-comment
            endpoint: `/spi/v3/candidates/${input.candidateId}/comments`,
            data: {
                member_id: memberId,
                comment: {
                    body: input.body,
                    ...(policy && { policy })
                }
            },
            retries: 3
        });

        return {
            id: response.data.id ?? '',
            body: input.body,
            createdAt: null,
            providerSpecific: {}
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
