import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteLeadInput = z.object({
    id: z.string().describe('Close CRM lead ID to delete. Example: "lead_XXXXXXXXXXXXXXXXXXXXXXXX"')
});

const DeleteLeadOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete a lead in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/leads',
        group: 'Leads'
    },

    input: DeleteLeadInput,
    output: DeleteLeadOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof DeleteLeadOutput>> => {
        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/leads/
            endpoint: `/api/v1/lead/${input.id}/`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
