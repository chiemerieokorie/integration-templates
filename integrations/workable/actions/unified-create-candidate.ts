import { createAction } from 'nango';
import { CreateAtsCandidateInput } from '../../shared/models/ats/create-ats-candidate-input.js';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';

const action = createAction({
    description: 'Create a candidate in Workable using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/candidates',
        group: 'Unified ATS'
    },

    input: CreateAtsCandidateInput,
    output: StandardCandidate,
    scopes: ['w_candidates'],

    exec: async (nango, input) => {
        const shortcode = input.providerSpecific?.shortcode as string | undefined;
        if (!shortcode) {
            throw new nango.ActionError({
                message: 'providerSpecific.shortcode (job shortcode) is required for Workable'
            });
        }

        if (!input.email) {
            throw new nango.ActionError({
                message: 'email is required for Workable candidates'
            });
        }

        const name = `${input.firstName} ${input.lastName}`.trim();

        const socialProfiles = (input.socialLinks ?? []).map((l) => ({
            type: l.type,
            url: l.url
        }));

        const data = {
            shortcode,
            candidate: {
                name,
                firstname: input.firstName,
                lastname: input.lastName,
                email: input.email,
                ...(input.title && { headline: input.title }),
                ...(input.location && { address: input.location }),
                ...(input.phone && { phone: input.phone }),
                ...(input.tags && { tags: input.tags }),
                ...(socialProfiles.length > 0 && { social_profiles: socialProfiles })
            }
        };

        const response = await nango.post({
            // https://workable.readme.io/reference/job-candidates-create
            endpoint: `/spi/v3/jobs/${shortcode}/candidates`,
            data,
            retries: 3
        });

        return toStandardCandidate(response.data.candidate ?? response.data);
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
