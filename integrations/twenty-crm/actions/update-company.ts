import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateCompanyInput = z.object({
    id: z.string().describe('Twenty CRM company UUID. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"'),
    name: z.string().optional(),
    domain_name: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    address_street: z.string().optional(),
    employees: z.number().optional()
});

const UpdateCompanyOutput = z.object({
    id: z.string(),
    updated_at: z.string().nullable()
});

interface TwentyCompanyResponse {
    id: string;
    updatedAt: string | null;
}

const action = createAction({
    description: 'Update a company in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/companies',
        group: 'Companies'
    },

    input: UpdateCompanyInput,
    output: UpdateCompanyOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof UpdateCompanyOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.name !== undefined) data['name'] = input.name;
        if (input.domain_name !== undefined) data['domainName'] = { primaryLinkUrl: input.domain_name };
        if (input.employees !== undefined) data['employees'] = input.employees;

        if (input.city !== undefined || input.country !== undefined || input.address_street !== undefined) {
            data['address'] = {
                ...(input.city !== undefined && { addressCity: input.city }),
                ...(input.country !== undefined && { addressCountry: input.country }),
                ...(input.address_street !== undefined && { addressStreet1: input.address_street })
            };
        }

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/companies/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<TwentyCompanyResponse>(config);

        return {
            id: response.data.id,
            updated_at: response.data.updatedAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
