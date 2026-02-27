import { z } from 'zod';
import { createSync } from 'nango';

const Lead = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    url: z.string().nullable(),
    status_id: z.string().nullable(),
    status_label: z.string().nullable(),
    created_by: z.string().nullable(),
    updated_by: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Lead = z.infer<typeof Lead>;

interface CloseLeadResponse {
    data: Array<{
        id: string;
        display_name: string | null;
        description: string | null;
        url: string | null;
        status_id: string | null;
        status_label: string | null;
        created_by: string | null;
        updated_by: string | null;
        date_created: string | null;
        date_updated: string | null;
    }>;
    has_more: boolean;
}

const sync = createSync({
    description: 'Fetches all leads from Close CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/leads' }],
    scopes: [],
    models: { Lead },
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

            const response = await nango.get<CloseLeadResponse>({
                // https://developer.close.com/resources/leads/
                endpoint: '/api/v1/lead/',
                params,
                retries: 3
            });

            const leads: Lead[] = response.data.data.map((lead) => ({
                id: lead.id,
                name: lead.display_name ?? null,
                description: lead.description ?? null,
                url: lead.url ?? null,
                status_id: lead.status_id ?? null,
                status_label: lead.status_label ?? null,
                created_by: lead.created_by ?? null,
                updated_by: lead.updated_by ?? null,
                created_at: lead.date_created ?? null,
                updated_at: lead.date_updated ?? null
            }));

            await nango.batchSave(leads, 'Lead');

            hasMore = response.data.has_more;
            skip += limit;
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
