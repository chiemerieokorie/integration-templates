import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateDealInput = z.object({
    name: z.string(),
    stage: z.string(),
    close_date: z.string().describe('Deal close date in YYYY-MM-DD format. Example: "2025-12-31"'),
    amount: z.number().optional(),
    probability: z.number().optional(),
    description: z.string().optional(),
    account_id: z.string().optional().describe('Zoho account ID to associate. Example: "3477061000000173001"'),
    contact_id: z.string().optional().describe('Zoho contact ID to associate. Example: "3477061000000173001"'),
    owner_id: z.string().optional().describe('Zoho user ID to set as owner. Example: "3477061000000173001"'),
    lead_source: z.string().optional(),
    next_step: z.string().optional()
});

const CreateDealOutput = z.object({
    id: z.string(),
    name: z.string(),
    stage: z.string(),
    amount: z.number().nullable(),
    close_date: z.string(),
    owner_id: z.string().nullable(),
    created_at: z.string().nullable()
});

interface ZohoCreateResponse {
    data: Array<{
        code: string;
        details: {
            id: string;
            Created_By: { id: string; name: string };
            Created_Time: string;
        };
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Create a single deal in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/deals',
        group: 'Deals'
    },

    input: CreateDealInput,
    output: CreateDealOutput,
    scopes: ['ZohoCRM.modules.deals.CREATE'],

    exec: async (nango, input): Promise<z.infer<typeof CreateDealOutput>> => {
        const data: Record<string, unknown> = {
            Deal_Name: input.name,
            Stage: input.stage,
            Closing_Date: input.close_date
        };

        if (input.amount !== undefined) data['Amount'] = input.amount;
        if (input.probability !== undefined) data['Probability'] = input.probability;
        if (input.description) data['Description'] = input.description;
        if (input.account_id) data['Account_Name'] = { id: input.account_id };
        if (input.contact_id) data['Contact_Name'] = { id: input.contact_id };
        if (input.owner_id) data['Owner'] = { id: input.owner_id };
        if (input.lead_source) data['Lead_Source'] = input.lead_source;
        if (input.next_step) data['Next_Step'] = input.next_step;

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html
            endpoint: '/crm/v2/Deals',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.post<ZohoCreateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to create deal: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            name: input.name,
            stage: input.stage,
            amount: input.amount ?? null,
            close_date: input.close_date,
            owner_id: input.owner_id ?? null,
            created_at: result.details.Created_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
