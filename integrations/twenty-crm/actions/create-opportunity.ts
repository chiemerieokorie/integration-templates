import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateOpportunityInput = z.object({
    name: z.string(),
    stage: z.string().describe('Opportunity stage. Example: "NEW", "SCREENING", "MEETING", "PROPOSAL", "CUSTOMER"'),
    amount: z.number().optional().describe('Deal amount in currency units. Example: 5000.00'),
    currency_code: z.string().optional().describe('3-letter currency code. Example: "USD"'),
    close_date: z.string().optional().describe('Expected close date in YYYY-MM-DD format. Example: "2025-12-31"'),
    probability: z.number().optional().describe('Win probability percentage 0-100. Example: 75'),
    company_id: z.string().optional().describe('Twenty CRM company UUID to associate.'),
    point_of_contact_id: z.string().optional().describe('Twenty CRM person UUID as primary contact.')
});

const CreateOpportunityOutput = z.object({
    id: z.string(),
    name: z.string(),
    stage: z.string(),
    amount: z.number().nullable(),
    created_at: z.string().nullable()
});

interface TwentyOpportunityResponse {
    id: string;
    name: string;
    stage: string;
    amount: { amountMicros: number | null; currencyCode: string | null } | null;
    createdAt: string | null;
}

const action = createAction({
    description: 'Create a new opportunity in Twenty CRM',
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
        const data: Record<string, unknown> = {
            name: input.name,
            stage: input.stage
        };

        if (input.amount !== undefined) {
            data['amount'] = {
                amountMicros: Math.round(input.amount * 1_000_000),
                currencyCode: input.currency_code ?? 'USD'
            };
        }
        if (input.close_date) data['closeDate'] = input.close_date;
        if (input.probability !== undefined) data['probability'] = input.probability;
        if (input.company_id) data['companyId'] = input.company_id;
        if (input.point_of_contact_id) data['pointOfContactId'] = input.point_of_contact_id;

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: '/rest/opportunities',
            data,
            retries: 3
        };

        const response = await nango.post<TwentyOpportunityResponse>(config);
        const opp = response.data;

        return {
            id: opp.id,
            name: opp.name,
            stage: opp.stage,
            amount: opp.amount?.amountMicros != null ? opp.amount.amountMicros / 1_000_000 : null,
            created_at: opp.createdAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
