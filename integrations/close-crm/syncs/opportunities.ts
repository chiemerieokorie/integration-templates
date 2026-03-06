import { z } from 'zod';
import { createSync } from 'nango';

const Opportunity = z.object({
    id: z.string(),
    lead_id: z.string().nullable(),
    lead_name: z.string().nullable(),
    status_id: z.string().nullable(),
    status_label: z.string().nullable(),
    status_type: z.string().nullable(),
    note: z.string().nullable(),
    value: z.number().nullable(),
    value_period: z.string().nullable(),
    confidence: z.number().nullable(),
    date_won: z.string().nullable(),
    user_id: z.string().nullable(),
    user_name: z.string().nullable(),
    pipeline_id: z.string().nullable(),
    pipeline_name: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Opportunity = z.infer<typeof Opportunity>;

interface CloseOpportunityResponse {
    data: Array<{
        id: string;
        lead_id: string | null;
        lead_name: string | null;
        status_id: string | null;
        status_label: string | null;
        status_type: string | null;
        note: string | null;
        value: number | null;
        value_period: string | null;
        confidence: number | null;
        date_won: string | null;
        user_id: string | null;
        user_name: string | null;
        pipeline_id: string | null;
        pipeline_name: string | null;
        date_created: string | null;
        date_updated: string | null;
    }>;
    has_more: boolean;
    cursor: string | null;
}

const sync = createSync({
    description: 'Fetches all opportunities from Close CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/opportunities' }],
    scopes: [],
    models: { Opportunity },
    metadata: z.object({}),

    exec: async (nango) => {
        let skip = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
            const params: Record<string, string> = {
                _limit: String(limit),
                _skip: String(skip)
            };
            if (nango.lastSyncDate) {
                params['date_updated__gte'] = nango.lastSyncDate.toISOString();
            }

            const response = await nango.get<CloseOpportunityResponse>({
                // https://developer.close.com/resources/opportunities/
                endpoint: '/api/v1/opportunity/',
                params,
                retries: 3
            });

            const opportunities: Opportunity[] = response.data.data.map((o) => ({
                id: o.id,
                lead_id: o.lead_id ?? null,
                lead_name: o.lead_name ?? null,
                status_id: o.status_id ?? null,
                status_label: o.status_label ?? null,
                status_type: o.status_type ?? null,
                note: o.note ?? null,
                value: o.value ?? null,
                value_period: o.value_period ?? null,
                confidence: o.confidence ?? null,
                date_won: o.date_won ?? null,
                user_id: o.user_id ?? null,
                user_name: o.user_name ?? null,
                pipeline_id: o.pipeline_id ?? null,
                pipeline_name: o.pipeline_name ?? null,
                created_at: o.date_created ?? null,
                updated_at: o.date_updated ?? null
            }));

            await nango.batchSave(opportunities, 'Opportunity');

            hasMore = response.data.has_more;
            skip += limit;
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
