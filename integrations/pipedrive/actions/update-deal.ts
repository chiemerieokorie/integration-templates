import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateDealInput = z.object({
    id: z.number().describe('Pipedrive deal ID. Example: 12345'),
    title: z.string().optional(),
    value: z.number().optional(),
    currency: z.string().optional(),
    stage_id: z.number().optional(),
    person_id: z.number().optional(),
    org_id: z.number().optional(),
    owner_id: z.number().optional(),
    expected_close_date: z.string().optional(),
    probability: z.number().optional(),
    status: z.string().optional(),
    lost_reason: z.string().optional()
});

const UpdateDealOutput = z.object({
    id: z.number(),
    title: z.string(),
    updated_at: z.string().nullable()
});

interface PipedriveDealUpdateResponse {
    success: boolean;
    data: {
        id: number;
        title: string;
        update_time: string;
    };
}

const action = createAction({
    description: 'Update a deal in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/deals',
        group: 'Deals'
    },

    input: UpdateDealInput,
    output: UpdateDealOutput,
    scopes: ['deals:full'],

    exec: async (nango, input): Promise<z.infer<typeof UpdateDealOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.title !== undefined) data['title'] = input.title;
        if (input.value !== undefined) data['value'] = input.value;
        if (input.currency !== undefined) data['currency'] = input.currency;
        if (input.stage_id !== undefined) data['stage_id'] = input.stage_id;
        if (input.person_id !== undefined) data['person_id'] = input.person_id;
        if (input.org_id !== undefined) data['org_id'] = input.org_id;
        if (input.owner_id !== undefined) data['user_id'] = input.owner_id;
        if (input.expected_close_date !== undefined) data['expected_close_date'] = input.expected_close_date;
        if (input.probability !== undefined) data['probability'] = input.probability;
        if (input.status !== undefined) data['status'] = input.status;
        if (input.lost_reason !== undefined) data['lost_reason'] = input.lost_reason;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal
            endpoint: `/v1/deals/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<PipedriveDealUpdateResponse>(config);
        const deal = response.data.data;

        return {
            id: deal.id,
            title: deal.title,
            updated_at: deal.update_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
