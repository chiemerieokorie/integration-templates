import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateCompanyInput = z.object({
    name: z.string(),
    domain_name: z.string().optional().describe('Company website domain. Example: "acmecorp.com"'),
    city: z.string().optional(),
    country: z.string().optional(),
    address_street: z.string().optional(),
    employees: z.number().optional()
});

const CreateCompanyOutput = z.object({
    id: z.string(),
    name: z.string(),
    domain_name: z.string().nullable(),
    created_at: z.string().nullable()
});

interface TwentyCompanyResponse {
    id: string;
    name: string;
    domainName: { primaryLinkUrl: string | null } | null;
    createdAt: string | null;
}

const action = createAction({
    description: 'Create a new company in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/companies',
        group: 'Companies'
    },

    input: CreateCompanyInput,
    output: CreateCompanyOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof CreateCompanyOutput>> => {
        const data: Record<string, unknown> = { name: input.name };

        if (input.domain_name) {
            data['domainName'] = { primaryLinkUrl: input.domain_name };
        }

        if (input.city || input.country || input.address_street) {
            data['address'] = {
                ...(input.city && { addressCity: input.city }),
                ...(input.country && { addressCountry: input.country }),
                ...(input.address_street && { addressStreet1: input.address_street })
            };
        }

        if (input.employees !== undefined) data['employees'] = input.employees;

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: '/rest/companies',
            data,
            retries: 3
        };

        const response = await nango.post<TwentyCompanyResponse>(config);
        const company = response.data;

        return {
            id: company.id,
            name: company.name,
            domain_name: company.domainName?.primaryLinkUrl ?? null,
            created_at: company.createdAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
