import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdatePersonInput = z.object({
    id: z.number().describe('Pipedrive person ID. Example: 12345'),
    name: z.string().optional(),
    email: z.array(z.string()).optional(),
    phone: z.array(z.string()).optional(),
    job_title: z.string().optional(),
    org_id: z.number().optional(),
    owner_id: z.number().optional(),
    visible_to: z.string().optional()
});

const UpdatePersonOutput = z.object({
    id: z.number(),
    name: z.string(),
    updated_at: z.string().nullable()
});

interface PipedrivePersonUpdateResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        update_time: string;
    };
}

const action = createAction({
    description: 'Update a person (contact) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/persons',
        group: 'Persons'
    },

    input: UpdatePersonInput,
    output: UpdatePersonOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof UpdatePersonOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.name !== undefined) data['name'] = input.name;
        if (input.email !== undefined) data['email'] = input.email.map((e, i) => ({ value: e, primary: i === 0 }));
        if (input.phone !== undefined) data['phone'] = input.phone.map((p, i) => ({ value: p, primary: i === 0 }));
        if (input.job_title !== undefined) data['job_title'] = input.job_title;
        if (input.org_id !== undefined) data['org_id'] = input.org_id;
        if (input.owner_id !== undefined) data['owner_id'] = input.owner_id;
        if (input.visible_to !== undefined) data['visible_to'] = input.visible_to;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson
            endpoint: `/v1/persons/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<PipedrivePersonUpdateResponse>(config);
        const person = response.data.data;

        return {
            id: person.id,
            name: person.name,
            updated_at: person.update_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
