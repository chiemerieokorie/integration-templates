import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateLeadInput = z.object({
    id: z.string().describe('Close CRM lead ID. Example: "lead_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    name: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    status_id: z.string().optional()
});

const UpdateLeadOutput = z.object({
    id: z.string(),
    name: z.string().nullable(),
    updated_at: z.string().nullable()
});

interface CloseLeadResponse {
    id: string;
    display_name: string | null;
    date_updated: string | null;
}

const action = createAction({
    description: 'Update a lead in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/leads',
        group: 'Leads'
    },

    input: UpdateLeadInput,
    output: UpdateLeadOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof UpdateLeadOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.name !== undefined) data['name'] = input.name;
        if (input.description !== undefined) data['description'] = input.description;
        if (input.url !== undefined) data['url'] = input.url;
        if (input.status_id !== undefined) data['status_id'] = input.status_id;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/leads/
            endpoint: `/api/v1/lead/${input.id}/`,
            data,
            retries: 3
        };

        const response = await nango.patch<CloseLeadResponse>(config);
        const lead = response.data;

        return {
            id: lead.id,
            name: lead.display_name ?? null,
            updated_at: lead.date_updated ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
