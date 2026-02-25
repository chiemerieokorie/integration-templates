import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { CreateAtsCandidateInput } from '../../shared/models/ats/create-ats-candidate-input.js';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';

const action = createAction({
    description: 'Create a candidate (opportunity) in Lever using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/candidates',
        group: 'Unified ATS'
    },

    input: CreateAtsCandidateInput,
    output: StandardCandidate,
    scopes: ['opportunities:write:admin'],

    exec: async (nango, input) => {
        const performAs = input.providerSpecific?.perform_as as string | undefined;
        if (!performAs) {
            throw new nango.ActionError({
                message: 'providerSpecific.perform_as is required for Lever'
            });
        }

        const name = `${input.firstName} ${input.lastName}`.trim();

        const phones = input.phone ? [{ value: input.phone, type: 'mobile' }] : [];
        const emails = input.email ? [input.email] : [];
        const links = (input.socialLinks ?? []).map((l) => l.url);

        const data: Record<string, unknown> = {
            name,
            ...(input.title && { headline: input.title }),
            ...(input.location && { location: input.location }),
            phones,
            emails,
            links,
            tags: input.tags ?? [],
            ...(input.source && { sources: [input.source] })
        };

        const config: ProxyConfiguration = {
            // https://hire.lever.co/developer/documentation#create-an-opportunity
            endpoint: '/v1/opportunities',
            data,
            params: { perform_as: performAs },
            retries: 3
        };

        const response = await nango.post(config);

        return toStandardCandidate(response.data.data);
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
