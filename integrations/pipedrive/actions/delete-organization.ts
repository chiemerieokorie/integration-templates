import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteOrganizationInput = z.object({
    id: z.number().describe('Pipedrive organization ID to delete. Example: 12345')
});

const DeleteOrganizationOutput = z.object({
    success: z.boolean(),
    id: z.number()
});

interface PipedriveDeleteResponse {
    success: boolean;
    data: { id: number };
}

const action = createAction({
    description: 'Delete an organization (company) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/organizations',
        group: 'Organizations'
    },

    input: DeleteOrganizationInput,
    output: DeleteOrganizationOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof DeleteOrganizationOutput>> => {
        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Organizations#deleteOrganization
            endpoint: `/v1/organizations/${input.id}`,
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
