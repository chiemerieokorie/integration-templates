import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreatePersonInput = z.object({
    name: z.string(),
    email: z.array(z.string()).optional(),
    phone: z.array(z.string()).optional(),
    job_title: z.string().optional(),
    org_id: z.number().optional().describe('Pipedrive organization ID to associate. Example: 12345'),
    owner_id: z.number().optional().describe('Pipedrive user ID to set as owner. Example: 12345'),
    visible_to: z.string().optional().describe('Visibility. Example: "3" (everyone)')
});

const CreatePersonOutput = z.object({
    id: z.number(),
    name: z.string(),
    email: z.array(z.string()).nullable(),
    phone: z.array(z.string()).nullable(),
    job_title: z.string().nullable(),
    org_id: z.number().nullable(),
    owner_id: z.number().nullable(),
    created_at: z.string().nullable()
});

interface PipedrivePersonResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        email: Array<{ value: string; primary: boolean }>;
        phone: Array<{ value: string; primary: boolean }>;
        job_title: string | null;
        org_id: { value: number } | null;
        owner_id: { id: number } | null;
        add_time: string;
    };
}

const action = createAction({
    description: 'Create a new person (contact) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/persons',
        group: 'Persons'
    },

    input: CreatePersonInput,
    output: CreatePersonOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof CreatePersonOutput>> => {
        const data: Record<string, unknown> = { name: input.name };

        if (input.email && input.email.length > 0) {
            data['email'] = input.email.map((e, i) => ({ value: e, primary: i === 0 }));
        }
        if (input.phone && input.phone.length > 0) {
            data['phone'] = input.phone.map((p, i) => ({ value: p, primary: i === 0 }));
        }
        if (input.job_title) data['job_title'] = input.job_title;
        if (input.org_id) data['org_id'] = input.org_id;
        if (input.owner_id) data['owner_id'] = input.owner_id;
        if (input.visible_to) data['visible_to'] = input.visible_to;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Persons#addPerson
            endpoint: '/v1/persons',
            data,
            retries: 3
        };

        const response = await nango.post<PipedrivePersonResponse>(config);
        const person = response.data.data;

        return {
            id: person.id,
            name: person.name,
            email: person.email?.map((e) => e.value) ?? null,
            phone: person.phone?.map((p) => p.value) ?? null,
            job_title: person.job_title ?? null,
            org_id: person.org_id?.value ?? null,
            owner_id: person.owner_id?.id ?? null,
            created_at: person.add_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
