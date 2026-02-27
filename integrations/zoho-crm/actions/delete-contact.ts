import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteContactInput = z.object({
    id: z.string().describe('Zoho CRM contact ID to delete. Example: "3477061000000173001"')
});

const DeleteContactOutput = z.object({
    success: z.boolean()
});

interface ZohoDeleteResponse {
    data: Array<{
        code: string;
        details: Record<string, unknown>;
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Delete a single contact in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/contacts',
        group: 'Contacts'
    },

    input: DeleteContactInput,
    output: DeleteContactOutput,
    scopes: ['ZohoCRM.modules.contacts.DELETE'],

    exec: async (nango, input): Promise<z.infer<typeof DeleteContactOutput>> => {
        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/delete-records.html
            endpoint: `/crm/v2/Contacts/${input.id}`,
            retries: 3
        };

        const response = await nango.delete<ZohoDeleteResponse>(config);
        const result = response.data.data[0];

        return { success: result?.status === 'success' };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
