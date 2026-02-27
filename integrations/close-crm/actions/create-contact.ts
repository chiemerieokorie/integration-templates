import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateContactInput = z.object({
    lead_id: z.string().describe('Close CRM lead ID to associate with. Example: "lead_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    emails: z.array(z.object({
        email: z.string(),
        type: z.string().describe('Email type. Example: "office", "personal", "other"')
    })).optional(),
    phones: z.array(z.object({
        phone: z.string(),
        type: z.string().describe('Phone type. Example: "mobile", "office", "home"')
    })).optional()
});

const CreateContactOutput = z.object({
    id: z.string(),
    lead_id: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    name: z.string().nullable(),
    title: z.string().nullable(),
    created_at: z.string().nullable()
});

interface CloseContactResponse {
    id: string;
    lead_id: string | null;
    first_name: string | null;
    last_name: string | null;
    name: string | null;
    title: string | null;
    date_created: string | null;
}

const action = createAction({
    description: 'Create a new contact in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/contacts',
        group: 'Contacts'
    },

    input: CreateContactInput,
    output: CreateContactOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof CreateContactOutput>> => {
        const data: Record<string, unknown> = { lead_id: input.lead_id };

        if (input.first_name) data['first_name'] = input.first_name;
        if (input.last_name) data['last_name'] = input.last_name;
        if (input.name) data['name'] = input.name;
        if (input.title) data['title'] = input.title;
        if (input.emails) data['emails'] = input.emails;
        if (input.phones) data['phones'] = input.phones;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/contacts/
            endpoint: '/api/v1/contact/',
            data,
            retries: 3
        };

        const response = await nango.post<CloseContactResponse>(config);
        const contact = response.data;

        return {
            id: contact.id,
            lead_id: contact.lead_id ?? null,
            first_name: contact.first_name ?? null,
            last_name: contact.last_name ?? null,
            name: contact.name ?? null,
            title: contact.title ?? null,
            created_at: contact.date_created ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
