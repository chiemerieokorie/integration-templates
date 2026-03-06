import { z } from 'zod';
import { createSync } from 'nango';

const Opportunity = z.object({
    id: z.string(),
    name: z.string().nullable(),
    amount: z.number().nullable(),
    amount_currency: z.string().nullable(),
    close_date: z.string().nullable(),
    stage: z.string().nullable(),
    probability: z.number().nullable(),
    company_id: z.string().nullable(),
    point_of_contact_id: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Opportunity = z.infer<typeof Opportunity>;

interface TwentyOpportunitiesResponse {
    data: {
        opportunities: {
            edges: Array<{
                node: {
                    id: string;
                    name: string | null;
                    amount: { amountMicros: number | null; currencyCode: string | null } | null;
                    closeDate: string | null;
                    stage: string | null;
                    probability: number | null;
                    company: { id: string } | null;
                    pointOfContact: { id: string } | null;
                    createdAt: string | null;
                    updatedAt: string | null;
                };
            }>;
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string | null;
            };
        };
    };
}

const sync = createSync({
    description: 'Fetches all opportunities from Twenty CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/opportunities' }],
    scopes: [],
    models: { Opportunity },
    metadata: z.object({}),

    exec: async (nango) => {
        let cursor: string | null = null;

        do {
            const params: Record<string, string> = { limit: '60' };
            if (cursor) params['starting_after'] = cursor;
            if (nango.lastSyncDate) {
                params['filter'] = JSON.stringify({ updatedAt: { gte: nango.lastSyncDate.toISOString() } });
            }

            const response = await nango.get<TwentyOpportunitiesResponse>({
                // https://docs.twenty.com/developers/extend/capabilities/apis
                endpoint: '/rest/opportunities',
                params,
                retries: 3
            });

            const opps = response.data?.data?.opportunities;
            if (!opps) break;

            const records: Opportunity[] = opps.edges.map((edge) => ({
                id: edge.node.id,
                name: edge.node.name ?? null,
                amount: edge.node.amount?.amountMicros != null
                    ? edge.node.amount.amountMicros / 1_000_000
                    : null,
                amount_currency: edge.node.amount?.currencyCode ?? null,
                close_date: edge.node.closeDate ?? null,
                stage: edge.node.stage ?? null,
                probability: edge.node.probability ?? null,
                company_id: edge.node.company?.id ?? null,
                point_of_contact_id: edge.node.pointOfContact?.id ?? null,
                created_at: edge.node.createdAt ?? null,
                updated_at: edge.node.updatedAt ?? null
            }));

            await nango.batchSave(records, 'Opportunity');

            cursor = opps.pageInfo.hasNextPage ? (opps.pageInfo.endCursor ?? null) : null;
        } while (cursor);
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
