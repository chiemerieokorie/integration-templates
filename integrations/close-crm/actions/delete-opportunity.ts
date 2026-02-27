import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteOpportunityInput = z.object({
    id: z.string().describe('Close CRM opportunity ID to delete. Example: "oppo_XXXXXXXXXXXXXXXXXXXXXXXX"')
});

const DeleteOpportunityOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete an opportunity in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/opportunities',
        group: 'Opportunities'
    },

    input: DeleteOpportunityInput,
    output: DeleteOpportunityOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof DeleteOpportunityOutput>> => {
        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/opportunities/
            endpoint: `/api/v1/opportunity/${input.id}/`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
