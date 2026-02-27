import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateOpportunityInput = z.object({
    id: z.string().describe('Close CRM opportunity ID. Example: "oppo_XXXXXXXXXXXXXXXXXXXXXXXX"'),
    status_id: z.string().optional(),
    note: z.string().optional(),
    value: z.number().optional(),
    value_period: z.string().optional(),
    confidence: z.number().optional(),
    user_id: z.string().optional(),
    pipeline_id: z.string().optional(),
    date_won: z.string().optional()
});

const UpdateOpportunityOutput = z.object({
    id: z.string(),
    status_label: z.string().nullable(),
    updated_at: z.string().nullable()
});

interface CloseOpportunityResponse {
    id: string;
    status_label: string | null;
    date_updated: string | null;
}

const action = createAction({
    description: 'Update an opportunity in Close CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/opportunities',
        group: 'Opportunities'
    },

    input: UpdateOpportunityInput,
    output: UpdateOpportunityOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof UpdateOpportunityOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.status_id !== undefined) data['status_id'] = input.status_id;
        if (input.note !== undefined) data['note'] = input.note;
        if (input.value !== undefined) data['value'] = input.value;
        if (input.value_period !== undefined) data['value_period'] = input.value_period;
        if (input.confidence !== undefined) data['confidence'] = input.confidence;
        if (input.user_id !== undefined) data['user_id'] = input.user_id;
        if (input.pipeline_id !== undefined) data['pipeline_id'] = input.pipeline_id;
        if (input.date_won !== undefined) data['date_won'] = input.date_won;

        const config: ProxyConfiguration = {
            // https://developer.close.com/resources/opportunities/
            endpoint: `/api/v1/opportunity/${input.id}/`,
            data,
            retries: 3
        };

        const response = await nango.patch<CloseOpportunityResponse>(config);
        const opp = response.data;

        return {
            id: opp.id,
            status_label: opp.status_label ?? null,
            updated_at: opp.date_updated ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
