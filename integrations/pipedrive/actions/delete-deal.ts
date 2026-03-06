import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteDealInput = z.object({
    id: z.number().describe('Pipedrive deal ID to delete. Example: 12345')
});

const DeleteDealOutput = z.object({
    success: z.boolean(),
    id: z.number()
});

interface PipedriveDeleteResponse {
    success: boolean;
    data: { id: number };
}

const action = createAction({
    description: 'Delete a deal in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/deals',
        group: 'Deals'
    },

    input: DeleteDealInput,
    output: DeleteDealOutput,
    scopes: ['deals:full'],

    exec: async (nango, input): Promise<z.infer<typeof DeleteDealOutput>> => {
        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Deals#deleteDeal
            endpoint: `/v1/deals/${input.id}`,
            retries: 3
        };

        const response = await nango.delete<PipedriveDeleteResponse>(config);

        return {
            success: response.data.success,
            id: response.data.data.id
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
