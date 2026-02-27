import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteAccountInput = z.object({
    id: z.string().describe('Zoho CRM account ID to delete. Example: "3477061000000173001"')
});

const DeleteAccountOutput = z.object({
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
    description: 'Delete a single account in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/accounts',
        group: 'Accounts'
    },

    input: DeleteAccountInput,
    output: DeleteAccountOutput,
    scopes: ['ZohoCRM.modules.accounts.DELETE'],

    exec: async (nango, input): Promise<z.infer<typeof DeleteAccountOutput>> => {
        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/delete-records.html
            endpoint: `/crm/v2/Accounts/${input.id}`,
            retries: 3
        };

        const response = await nango.delete<ZohoDeleteResponse>(config);
        const result = response.data.data[0];

        return { success: result?.status === 'success' };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
