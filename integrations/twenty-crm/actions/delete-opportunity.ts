import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteOpportunityInput = z.object({
    id: z.string().describe('Twenty CRM opportunity UUID to delete. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"')
});

const DeleteOpportunityOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete an opportunity in Twenty CRM',
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
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/opportunities/${input.id}`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
