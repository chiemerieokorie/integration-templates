import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateLeadInput = z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    status_id: z.string().optional().describe('Lead status ID. Fetch available statuses via /api/v1/status/lead/'),
    contacts: z.array(z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        name: z.string().optional(),
        title: z.string().optional(),
        emails: z.array(z.object({ email: z.string(), type: z.string() })).optional(),
        phones: z.array(z.object({ phone: z.string(), type: z.string() })).optional()
    })).optional()
});

const CreateLeadOutput = z.object({
    id: z.string(),
    name: z.string().nullable(),
    status_id: z.string().nullable(),
    status_label: z.string().nullable(),
    created_at: z.string().nullable()
});

interface CloseLeadResponse {
    id: string;
    display_name: string | null;
    status_id: string | null;
    status_label: string | null;
    date_created: string | null;
}

const action = createAction({
    description: 'Create a new lead in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/leads',
        group: 'Leads'
    },

    input: CreateLeadInput,
    output: CreateLeadOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof CreateLeadOutput>> => {
        const data: Record<string, unknown> = { name: input.name };

        if (input.description) data['description'] = input.description;
        if (input.url) data['url'] = input.url;
        if (input.status_id) data['status_id'] = input.status_id;
        if (input.contacts) data['contacts'] = input.contacts;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/leads/
            endpoint: '/api/v1/lead/',
            data,
            retries: 3
        };

        const response = await nango.post<CloseLeadResponse>(config);
        const lead = response.data;

        return {
            id: lead.id,
            name: lead.display_name ?? null,
            status_id: lead.status_id ?? null,
            status_label: lead.status_label ?? null,
            created_at: lead.date_created ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
