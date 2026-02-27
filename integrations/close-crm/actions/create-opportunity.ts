import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateOpportunityInput = z.object({
    lead_id: z.string().describe('Close CRM lead ID. Example: "lead_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    status_id: z.string().optional().describe('Opportunity status ID. Fetch from /api/v1/status/opportunity/'),
    note: z.string().optional(),
    value: z.number().optional().describe('Deal value in cents. Example: 50000 = $500.00'),
    value_period: z.string().optional().describe('Value period. Example: "one_time", "monthly", "annual"'),
    confidence: z.number().optional().describe('Confidence percentage 0-100. Example: 75'),
    user_id: z.string().optional().describe('Assigned user ID. Example: "user_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    pipeline_id: z.string().optional()
});

const CreateOpportunityOutput = z.object({
    id: z.string(),
    lead_id: z.string().nullable(),
    status_id: z.string().nullable(),
    status_label: z.string().nullable(),
    status_type: z.string().nullable(),
    value: z.number().nullable(),
    value_period: z.string().nullable(),
    created_at: z.string().nullable()
});

interface CloseOpportunityResponse {
    id: string;
    lead_id: string | null;
    status_id: string | null;
    status_label: string | null;
    status_type: string | null;
    value: number | null;
    value_period: string | null;
    date_created: string | null;
}

const action = createAction({
    description: 'Create a new opportunity in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/opportunities',
        group: 'Opportunities'
    },

    input: CreateOpportunityInput,
    output: CreateOpportunityOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof CreateOpportunityOutput>> => {
        const data: Record<string, unknown> = { lead_id: input.lead_id };

        if (input.status_id) data['status_id'] = input.status_id;
        if (input.note) data['note'] = input.note;
        if (input.value !== undefined) data['value'] = input.value;
        if (input.value_period) data['value_period'] = input.value_period;
        if (input.confidence !== undefined) data['confidence'] = input.confidence;
        if (input.user_id) data['user_id'] = input.user_id;
        if (input.pipeline_id) data['pipeline_id'] = input.pipeline_id;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/opportunities/
            endpoint: '/api/v1/opportunity/',
            data,
            retries: 3
        };

        const response = await nango.post<CloseOpportunityResponse>(config);
        const opp = response.data;

        return {
            id: opp.id,
            lead_id: opp.lead_id ?? null,
            status_id: opp.status_id ?? null,
            status_label: opp.status_label ?? null,
            status_type: opp.status_type ?? null,
            value: opp.value ?? null,
            value_period: opp.value_period ?? null,
            created_at: opp.date_created ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
