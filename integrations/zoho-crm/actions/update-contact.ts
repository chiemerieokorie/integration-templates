import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateContactInput = z.object({
    id: z.string().describe('Zoho CRM contact ID. Example: "3477061000000173001"'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    title: z.string().optional(),
    department: z.string().optional(),
    account_id: z.string().optional(),
    owner_id: z.string().optional(),
    lead_source: z.string().optional()
});

const UpdateContactOutput = z.object({
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
    description: 'Update a single contact in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/contacts',
        group: 'Contacts'
    },

    input: UpdateContactInput,
    output: UpdateContactOutput,
    scopes: ['ZohoCRM.modules.contacts.UPDATE'],

    exec: async (nango, input): Promise<z.infer<typeof UpdateContactOutput>> => {
        const data: Record<string, unknown> = { id: input.id };

        if (input.first_name !== undefined) data['First_Name'] = input.first_name;
        if (input.last_name !== undefined) data['Last_Name'] = input.last_name;
        if (input.email !== undefined) data['Email'] = input.email;
        if (input.phone !== undefined) data['Phone'] = input.phone;
        if (input.mobile !== undefined) data['Mobile'] = input.mobile;
        if (input.title !== undefined) data['Title'] = input.title;
        if (input.department !== undefined) data['Department'] = input.department;
        if (input.account_id !== undefined) data['Account_Name'] = { id: input.account_id };
        if (input.owner_id !== undefined) data['Owner'] = { id: input.owner_id };
        if (input.lead_source !== undefined) data['Lead_Source'] = input.lead_source;

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/update-records.html
            endpoint: '/crm/v2/Contacts',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.patch<ZohoUpdateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to update contact: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            updated_at: result.details.Modified_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
