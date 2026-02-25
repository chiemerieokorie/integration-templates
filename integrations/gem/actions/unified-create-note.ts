import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { CreateAtsNoteInput, AtsNote } from '../../shared/models/ats/create-ats-note-input.js';

const action = createAction({
    description: 'Create a note on a candidate in Gem using the unified ATS input',
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

        const userId = input.providerSpecific?.user_id as string | undefined;
        if (!userId) {
            throw new nango.ActionError({
                message: 'providerSpecific.user_id is required for Gem'
            });
        }

        const config: ProxyConfiguration = {
            // https://api.gem.com/ats/v0/reference#tag/Candidate/paths/~1ats~1v0~1candidates~1%7Bcandidate_id%7D~1activity_feed~1notes/post
            endpoint: `/ats/v0/candidates/${input.candidateId}/activity_feed/notes`,
            data: {
                user_id: userId,
                body: input.body,
                visibility: input.visibility ?? 'public'
            },
            retries: 3
        };

        const response = await nango.post(config);
        const result = response.data;

        return {
            id: result.id,
            body: result.body ?? input.body,
            createdAt: result.created_at ?? null,
            providerSpecific: {
                user: result.user,
                visibility: result.visibility
            }
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
