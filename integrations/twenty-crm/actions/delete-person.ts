import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeletePersonInput = z.object({
    id: z.string().describe('Twenty CRM person UUID to delete. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"')
});

const DeletePersonOutput = z.object({
    success: z.boolean()
});

const action = createAction({
    description: 'Delete a person (contact) in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/people',
        group: 'People'
    },

    input: DeletePersonInput,
    output: DeletePersonOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof DeletePersonOutput>> => {
        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/people/${input.id}`,
            retries: 3
        };

        await nango.delete(config);
        return { success: true };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
