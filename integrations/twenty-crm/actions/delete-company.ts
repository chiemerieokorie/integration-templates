import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeleteCompanyInput = z.object({
    id: z.string().describe('Twenty CRM company UUID to delete. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"')
});

const DeleteCompanyOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete a company in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/companies',
        group: 'Companies'
    },

    input: DeleteCompanyInput,
    output: DeleteCompanyOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof DeleteCompanyOutput>> => {
        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/companies/${input.id}`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
