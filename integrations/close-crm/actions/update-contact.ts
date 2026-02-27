import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateContactInput = z.object({
    id: z.string().describe('Close CRM contact ID. Example: "cont_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    emails: z.array(z.object({ email: z.string(), type: z.string() })).optional(),
    phones: z.array(z.object({ phone: z.string(), type: z.string() })).optional()
});

const UpdateContactOutput = z.object({
    id: z.string(),
    name: z.string().nullable(),
    updated_at: z.string().nullable()
});

interface CloseContactResponse {
    id: string;
    name: string | null;
    date_updated: string | null;
}

const action = createAction({
    description: 'Update a contact in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/contacts',
        group: 'Contacts'
    },

    input: UpdateContactInput,
    output: UpdateContactOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof UpdateContactOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.first_name !== undefined) data['first_name'] = input.first_name;
        if (input.last_name !== undefined) data['last_name'] = input.last_name;
        if (input.name !== undefined) data['name'] = input.name;
        if (input.title !== undefined) data['title'] = input.title;
        if (input.emails !== undefined) data['emails'] = input.emails;
        if (input.phones !== undefined) data['phones'] = input.phones;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/contacts/
            endpoint: `/api/v1/contact/${input.id}/`,
            data,
            retries: 3
        };

        const response = await nango.patch<CloseContactResponse>(config);
        const contact = response.data;

        return {
            id: contact.id,
            name: contact.name ?? null,
            updated_at: contact.date_updated ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
