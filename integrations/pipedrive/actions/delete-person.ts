import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const DeletePersonInput = z.object({
    id: z.number().describe('Pipedrive person ID to delete. Example: 12345')
});

const DeletePersonOutput = z.object({
    success: z.boolean(),
    id: z.number()
});

interface PipedriveDeleteResponse {
    success: boolean;
    data: { id: number };
}

const action = createAction({
    description: 'Delete a person (contact) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'DELETE',
        path: '/persons',
        group: 'Persons'
    },

    input: DeletePersonInput,
    output: DeletePersonOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof DeletePersonOutput>> => {
        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Persons#deletePerson
            endpoint: `/v1/persons/${input.id}`,
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
