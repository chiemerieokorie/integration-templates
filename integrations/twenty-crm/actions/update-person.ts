import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdatePersonInput = z.object({
    id: z.string().describe('Twenty CRM person UUID. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    company_id: z.string().optional(),
    job_title: z.string().optional()
});

const UpdatePersonOutput = z.object({
    id: z.string(),
    updated_at: z.string().nullable()
});

interface TwentyPersonResponse {
    id: string;
    updatedAt: string | null;
}

const action = createAction({
    description: 'Update a person (contact) in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/people',
        group: 'People'
    },

    input: UpdatePersonInput,
    output: UpdatePersonOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof UpdatePersonOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.first_name !== undefined || input.last_name !== undefined) {
            data['name'] = {
                ...(input.first_name !== undefined && { firstName: input.first_name }),
                ...(input.last_name !== undefined && { lastName: input.last_name })
            };
        }
        if (input.email !== undefined) data['emails'] = { primaryEmail: input.email };
        if (input.phone !== undefined) data['phones'] = { primaryPhoneNumber: input.phone };
        if (input.city !== undefined) data['city'] = input.city;
        if (input.company_id !== undefined) data['companyId'] = input.company_id;
        if (input.job_title !== undefined) data['jobTitle'] = input.job_title;

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/people/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<TwentyPersonResponse>(config);

        return {
            id: response.data.id,
            updated_at: response.data.updatedAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
