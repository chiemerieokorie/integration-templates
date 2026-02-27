import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateContactInput = z.object({
    first_name: z.string().optional(),
    last_name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    title: z.string().optional(),
    department: z.string().optional(),
    account_id: z.string().optional().describe('Zoho account (company) ID to associate. Example: "3477061000000173001"'),
    owner_id: z.string().optional().describe('Zoho user ID to set as owner. Example: "3477061000000173001"'),
    lead_source: z.string().optional()
});

const CreateContactOutput = z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    mobile: z.string().nullable(),
    title: z.string().nullable(),
    department: z.string().nullable(),
    account_id: z.string().nullable(),
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
            Modified_By: { id: string; name: string };
            Modified_Time: string;
        };
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Create a single contact in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/contacts',
        group: 'Contacts'
    },

    input: CreateContactInput,
    output: CreateContactOutput,
    scopes: ['ZohoCRM.modules.contacts.CREATE'],

    exec: async (nango, input): Promise<z.infer<typeof CreateContactOutput>> => {
        const data: Record<string, unknown> = {
            Last_Name: input.last_name
        };

        if (input.first_name) data['First_Name'] = input.first_name;
        if (input.email) data['Email'] = input.email;
        if (input.phone) data['Phone'] = input.phone;
        if (input.mobile) data['Mobile'] = input.mobile;
        if (input.title) data['Title'] = input.title;
        if (input.department) data['Department'] = input.department;
        if (input.account_id) data['Account_Name'] = { id: input.account_id };
        if (input.owner_id) data['Owner'] = { id: input.owner_id };
        if (input.lead_source) data['Lead_Source'] = input.lead_source;

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html
            endpoint: '/crm/v2/Contacts',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.post<ZohoCreateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to create contact: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            first_name: input.first_name ?? null,
            last_name: input.last_name,
            email: input.email ?? null,
            phone: input.phone ?? null,
            mobile: input.mobile ?? null,
            title: input.title ?? null,
            department: input.department ?? null,
            account_id: input.account_id ?? null,
            owner_id: input.owner_id ?? null,
            created_at: result.details.Created_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
