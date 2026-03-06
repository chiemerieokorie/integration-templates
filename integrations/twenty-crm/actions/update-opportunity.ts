import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateOpportunityInput = z.object({
    id: z.string().describe('Twenty CRM opportunity UUID. Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"'),
    name: z.string().optional(),
    stage: z.string().optional(),
    amount: z.number().optional(),
    currency_code: z.string().optional(),
    close_date: z.string().optional(),
    probability: z.number().optional(),
    company_id: z.string().optional(),
    point_of_contact_id: z.string().optional()
});

const UpdateOpportunityOutput = z.object({
    id: z.string(),
    updated_at: z.string().nullable()
});

interface TwentyOpportunityResponse {
    id: string;
    updatedAt: string | null;
}

const action = createAction({
    description: 'Update an opportunity in Twenty CRM',
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

        if (input.name !== undefined) data['name'] = input.name;
        if (input.stage !== undefined) data['stage'] = input.stage;
        if (input.amount !== undefined) {
            data['amount'] = {
                amountMicros: Math.round(input.amount * 1_000_000),
                currencyCode: input.currency_code ?? 'USD'
            };
        }
        if (input.close_date !== undefined) data['closeDate'] = input.close_date;
        if (input.probability !== undefined) data['probability'] = input.probability;
        if (input.company_id !== undefined) data['companyId'] = input.company_id;
        if (input.point_of_contact_id !== undefined) data['pointOfContactId'] = input.point_of_contact_id;

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: `/rest/opportunities/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<TwentyOpportunityResponse>(config);

        return {
            id: response.data.id,
            updated_at: response.data.updatedAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
