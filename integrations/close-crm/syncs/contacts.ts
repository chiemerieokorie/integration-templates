import { z } from 'zod';
import { createSync } from 'nango';

const Contact = z.object({
    id: z.string(),
    lead_id: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    name: z.string().nullable(),
    title: z.string().nullable(),
    emails: z.array(z.object({ email: z.string(), type: z.string() })).nullable(),
    phones: z.array(z.object({ phone: z.string(), type: z.string() })).nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Contact = z.infer<typeof Contact>;

interface CloseContactResponse {
    data: Array<{
        id: string;
        lead_id: string | null;
        first_name: string | null;
        last_name: string | null;
        name: string | null;
        title: string | null;
        emails: Array<{ email: string; type: string }> | null;
        phones: Array<{ phone: string; type: string }> | null;
        date_created: string | null;
        date_updated: string | null;
    }>;
    has_more: boolean;
    cursor: string | null;
}

const sync = createSync({
    description: 'Fetches all contacts from Close CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/contacts' }],
    scopes: [],
    models: { Contact },
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

            const response = await nango.get<CloseContactResponse>({
                // https://developer.close.com/resources/contacts/
                endpoint: '/api/v1/contact/',
                params,
                retries: 3
            });

            const contacts: Contact[] = response.data.data.map((c) => ({
                id: c.id,
                lead_id: c.lead_id ?? null,
                first_name: c.first_name ?? null,
                last_name: c.last_name ?? null,
                name: c.name ?? null,
                title: c.title ?? null,
                emails: c.emails ?? null,
                phones: c.phones ?? null,
                created_at: c.date_created ?? null,
                updated_at: c.date_updated ?? null
            }));

            await nango.batchSave(contacts, 'Contact');

            hasMore = response.data.has_more;
            skip += limit;
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
