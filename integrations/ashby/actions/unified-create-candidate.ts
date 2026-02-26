import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { CreateAtsCandidateInput } from '../../shared/models/ats/create-ats-candidate-input.js';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';

const action = createAction({
    description: 'Create a candidate in Ashby using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/candidates',
        group: 'Unified ATS'
    },

    input: CreateAtsCandidateInput,
    output: StandardCandidate,

    exec: async (nango, input) => {
        const name = `${input.firstName} ${input.lastName}`.trim();
        if (!name) {
            throw new nango.ActionError({ message: 'firstName or lastName is required' });
        }

        const linkedInUrl = input.socialLinks?.find((l) => l.type === 'linkedin')?.url;
        const githubUrl = input.socialLinks?.find((l) => l.type === 'github')?.url;
        const websiteUrl = input.socialLinks?.find((l) => l.type === 'website' || l.type === 'url')?.url;

        const data: Record<string, unknown> = {
            name,
            ...(input.email && { email: input.email }),
            ...(input.phone && { phoneNumber: input.phone }),
            ...(linkedInUrl && { linkedInUrl }),
            ...(githubUrl && { githubUrl }),
            ...(websiteUrl && { website: websiteUrl }),
            ...(input.providerSpecific?.sourceId && { sourceId: input.providerSpecific.sourceId }),
            ...(input.providerSpecific?.creditedToUserId && { creditedToUserId: input.providerSpecific.creditedToUserId })
        };

        if (input.location) {
            data.location = { city: input.location };
        }

        const config: ProxyConfiguration = {
            // https://developers.ashbyhq.com/reference/candidatecreate
            endpoint: '/candidate.create',
            data,
            retries: 3
        };

        const response = await nango.post(config);

        if (!response.data.success) {
            throw new nango.ActionError({
                message: `Ashby API error: ${JSON.stringify(response.data.errors ?? 'unknown error')}`
            });
        }

        return toStandardCandidate(response.data.results);
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
