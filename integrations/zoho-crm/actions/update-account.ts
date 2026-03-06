import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateAccountInput = z.object({
    id: z.string().describe('Zoho CRM account ID. Example: "3477061000000173001"'),
    name: z.string().optional(),
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
    owner_id: z.string().optional()
});

const UpdateAccountOutput = z.object({
    id: z.string(),
    updated_at: z.string().nullable()
});

interface ZohoUpdateResponse {
    data: Array<{
        code: string;
        details: {
            id: string;
            Modified_By: { id: string; name: string };
            Modified_Time: string;
        };
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Update a single account in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/accounts',
        group: 'Accounts'
    },

    input: UpdateAccountInput,
    output: UpdateAccountOutput,
    scopes: ['ZohoCRM.modules.accounts.UPDATE'],

    exec: async (nango, input): Promise<z.infer<typeof UpdateAccountOutput>> => {
        const data: Record<string, unknown> = { id: input.id };

        if (input.name !== undefined) data['Account_Name'] = input.name;
        if (input.website !== undefined) data['Website'] = input.website;
        if (input.phone !== undefined) data['Phone'] = input.phone;
        if (input.industry !== undefined) data['Industry'] = input.industry;
        if (input.description !== undefined) data['Description'] = input.description;
        if (input.billing_city !== undefined) data['Billing_City'] = input.billing_city;
        if (input.billing_country !== undefined) data['Billing_Country'] = input.billing_country;
        if (input.billing_state !== undefined) data['Billing_State'] = input.billing_state;
        if (input.billing_street !== undefined) data['Billing_Street'] = input.billing_street;
        if (input.annual_revenue !== undefined) data['Annual_Revenue'] = input.annual_revenue;
        if (input.employees !== undefined) data['Employees'] = input.employees;
        if (input.owner_id !== undefined) data['Owner'] = { id: input.owner_id };

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/update-records.html
            endpoint: '/crm/v2/Accounts',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.patch<ZohoUpdateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to update account: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            updated_at: result.details.Modified_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
