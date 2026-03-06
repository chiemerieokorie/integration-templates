import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateDealInput = z.object({
    id: z.string().describe('Zoho CRM deal ID. Example: "3477061000000173001"'),
    name: z.string().optional(),
    stage: z.string().optional(),
    close_date: z.string().optional().describe('Deal close date in YYYY-MM-DD format. Example: "2025-12-31"'),
    amount: z.number().optional(),
    probability: z.number().optional(),
    description: z.string().optional(),
    account_id: z.string().optional(),
    contact_id: z.string().optional(),
    owner_id: z.string().optional(),
    lead_source: z.string().optional(),
    next_step: z.string().optional()
});

const UpdateDealOutput = z.object({
    id: z.string(),
    updated_at: z.string().nullable()
});

interface ZohoUpdateResponse {
    data: Array<{
        code: string;
        details: {
            id: string;
            Modified_By: { id: string; name: string };
            Modified_Time: string;
        };
        message: string;
        status: string;
    }>;
}

const action = createAction({
    description: 'Update a single deal in Zoho CRM',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/deals',
        group: 'Deals'
    },

    input: UpdateDealInput,
    output: UpdateDealOutput,
    scopes: ['ZohoCRM.modules.deals.UPDATE'],

    exec: async (nango, input): Promise<z.infer<typeof UpdateDealOutput>> => {
        const data: Record<string, unknown> = { id: input.id };

        if (input.name !== undefined) data['Deal_Name'] = input.name;
        if (input.stage !== undefined) data['Stage'] = input.stage;
        if (input.close_date !== undefined) data['Closing_Date'] = input.close_date;
        if (input.amount !== undefined) data['Amount'] = input.amount;
        if (input.probability !== undefined) data['Probability'] = input.probability;
        if (input.description !== undefined) data['Description'] = input.description;
        if (input.account_id !== undefined) data['Account_Name'] = { id: input.account_id };
        if (input.contact_id !== undefined) data['Contact_Name'] = { id: input.contact_id };
        if (input.owner_id !== undefined) data['Owner'] = { id: input.owner_id };
        if (input.lead_source !== undefined) data['Lead_Source'] = input.lead_source;
        if (input.next_step !== undefined) data['Next_Step'] = input.next_step;

        const config: ProxyConfiguration = {
            // https://www.zoho.com/crm/developer/docs/api/v2/update-records.html
            endpoint: '/crm/v2/Deals',
            data: { data: [data] },
            retries: 3
        };

        const response = await nango.patch<ZohoUpdateResponse>(config);
        const result = response.data.data[0];

        if (!result || result.status !== 'success') {
            throw new Error(`Failed to update deal: ${result?.message ?? 'Unknown error'}`);
        }

        return {
            id: result.details.id,
            updated_at: result.details.Modified_Time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
