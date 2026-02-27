import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateAccountInput = z.object({
    name: z.string(),
    website: z.string().optional(),
    phone: z.string().optional(),
    industry: z.string().optional(),
    description: z.string().optional(),
    billing_city: z.string().optional(),
    billing_country: z.string().optional(),
    billing_state: z.string().optional(),
    billing_street: z.string().optional(),
    annual_revenue: z.number().optional(),
    employees: z.number().optional(),
    owner_id: z.string().optional().describe('Zoho user ID to set as owner. Example: "3477061000000173001"')
});

const CreateAccountOutput = z.object({
    id: z.string(),
    name: z.string(),
    website: z.string().nullable(),
    phone: z.string().nullable(),
    industry: z.string().nullable(),
    owner_id: z.string().nullable(),
    created_at: z.string().nullable()
});

interface ZohoCreateResponse {
    data: Array<{
        code: string;
        details: {
            id: string;
            Created_By: { id: string; name: string };
            Created_Time: string;
        };
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Create a single account in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/accounts',
        group: 'Accounts'
    },

    input: CreateAccountInput,
    output: CreateAccountOutput,
    scopes: ['ZohoCRM.modules.accounts.CREATE'],

    exec: async (nango, input): Promise<z.infer<typeof CreateAccountOutput>> => {
        const data: Record<string, unknown> = {
            Account_Name: input.name
        };

        if (input.website) data['Website'] = input.website;
        if (input.phone) data['Phone'] = input.phone;
        if (input.industry) data['Industry'] = input.industry;
        if (input.description) data['Description'] = input.description;
        if (input.billing_city) data['Billing_City'] = input.billing_city;
        if (input.billing_country) data['Billing_Country'] = input.billing_country;
        if (input.billing_state) data['Billing_State'] = input.billing_state;
        if (input.billing_street) data['Billing_Street'] = input.billing_street;
        if (input.annual_revenue !== undefined) data['Annual_Revenue'] = input.annual_revenue;
        if (input.employees !== undefined) data['Employees'] = input.employees;
        if (input.owner_id) data['Owner'] = { id: input.owner_id };

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html
            endpoint: '/crm/v2/Accounts',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.post<ZohoCreateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to create account: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            name: input.name,
            website: input.website ?? null,
            phone: input.phone ?? null,
            industry: input.industry ?? null,
            owner_id: input.owner_id ?? null,
            created_at: result.details.Created_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
