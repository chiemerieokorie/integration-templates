import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { CreateAtsCandidateInput } from '../../shared/models/ats/create-ats-candidate-input.js';
import { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import { toStandardCandidate } from '../mappers/to-standard-candidate.js';

const action = createAction({
    description: 'Create a candidate in Gem using the unified ATS input',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/ats/candidates',
        group: 'Unified ATS'
    },

    input: CreateAtsCandidateInput,
    output: StandardCandidate,

    exec: async (nango, input) => {
        const createdBy = input.providerSpecific?.created_by as string | undefined;
        if (!createdBy) {
            throw new nango.ActionError({
                message: 'providerSpecific.created_by is required for Gem'
            });
        }

        const emails = input.email
            ? [{ email_address: input.email, is_primary: true }]
            : null;

        const linkedInHandle = input.socialLinks?.find((l) => l.type === 'linkedin')?.url ?? null;

        const data: Record<string, unknown> = {
            created_by: createdBy,
            first_name: input.firstName ?? null,
            last_name: input.lastName ?? null,
            nickname: null,
            emails,
            linked_in_handle: linkedInHandle,
            title: input.title ?? null,
            company: input.company ?? null,
            location: input.location ?? null,
            school: null,
            education_info: null,
            work_info: null,
            profile_urls: null,
            custom_fields: null,
            phone_number: input.phone ?? null,
            project_ids: null,
            sourced_from: input.source ?? null,
            autofill: false
        };

        const config: ProxyConfiguration = {
            // https://api.gem.com/ats/v0/reference#tag/Candidate/paths/~1ats~1v0~1candidates~1/post
            endpoint: '/ats/v0/candidates/',
            data,
            retries: 3
        };

        const response = await nango.post(config);

        return toStandardCandidate(response.data);
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
