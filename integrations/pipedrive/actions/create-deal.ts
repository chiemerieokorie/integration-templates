import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateDealInput = z.object({
    title: z.string(),
    value: z.number().optional(),
    currency: z.string().optional().describe('3-letter currency code. Example: "USD"'),
    stage_id: z.number().optional().describe('Pipeline stage ID. Example: 1'),
    pipeline_id: z.number().optional(),
    person_id: z.number().optional().describe('Pipedrive person ID to associate. Example: 12345'),
    org_id: z.number().optional().describe('Pipedrive organization ID to associate. Example: 12345'),
    owner_id: z.number().optional().describe('Pipedrive user ID to set as owner. Example: 12345'),
    expected_close_date: z.string().optional().describe('Expected close date in YYYY-MM-DD format. Example: "2025-12-31"'),
    probability: z.number().optional(),
    status: z.string().optional().describe('Deal status. Example: "open", "won", "lost"'),
    lost_reason: z.string().optional(),
    visible_to: z.string().optional()
});

const CreateDealOutput = z.object({
    id: z.number(),
    title: z.string(),
    value: z.number().nullable(),
    currency: z.string().nullable(),
    stage_id: z.number().nullable(),
    person_id: z.number().nullable(),
    org_id: z.number().nullable(),
    owner_id: z.number().nullable(),
    status: z.string().nullable(),
    created_at: z.string().nullable()
});

interface PipedriveDealResponse {
    success: boolean;
    data: {
        id: number;
        title: string;
        value: number | null;
        currency: string | null;
        stage_id: number | null;
        person_id: { value: number } | null;
        org_id: { value: number } | null;
        user_id: { id: number } | null;
        status: string | null;
        add_time: string;
    };
}

const action = createAction({
    description: 'Create a new deal in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/deals',
        group: 'Deals'
    },

    input: CreateDealInput,
    output: CreateDealOutput,
    scopes: ['deals:full'],

    exec: async (nango, input): Promise<z.infer<typeof CreateDealOutput>> => {
        const data: Record<string, unknown> = { title: input.title };

        if (input.value !== undefined) data['value'] = input.value;
        if (input.currency) data['currency'] = input.currency;
        if (input.stage_id) data['stage_id'] = input.stage_id;
        if (input.pipeline_id) data['pipeline_id'] = input.pipeline_id;
        if (input.person_id) data['person_id'] = input.person_id;
        if (input.org_id) data['org_id'] = input.org_id;
        if (input.owner_id) data['user_id'] = input.owner_id;
        if (input.expected_close_date) data['expected_close_date'] = input.expected_close_date;
        if (input.probability !== undefined) data['probability'] = input.probability;
        if (input.status) data['status'] = input.status;
        if (input.lost_reason) data['lost_reason'] = input.lost_reason;
        if (input.visible_to) data['visible_to'] = input.visible_to;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Deals#addDeal
            endpoint: '/v1/deals',
            data,
            retries: 3
        };

        const response = await nango.post<PipedriveDealResponse>(config);
        const deal = response.data.data;

        return {
            id: deal.id,
            title: deal.title,
            value: deal.value ?? null,
            currency: deal.currency ?? null,
            stage_id: deal.stage_id ?? null,
            person_id: deal.person_id?.value ?? null,
            org_id: deal.org_id?.value ?? null,
            owner_id: deal.user_id?.id ?? null,
            status: deal.status ?? null,
            created_at: deal.add_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
