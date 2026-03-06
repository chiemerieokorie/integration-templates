import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteContactInput = z.object({
    id: z.string().describe('Close CRM contact ID to delete. Example: "cont_XXXXXXXXXXXXXXXXXXXXXXXX"')
});

const DeleteContactOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete a contact in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/contacts',
        group: 'Contacts'
    },

    input: DeleteContactInput,
    output: DeleteContactOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof DeleteContactOutput>> => {
        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/contacts/
            endpoint: `/api/v1/contact/${input.id}/`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
