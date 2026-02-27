import { z } from 'zod';
import { createSync } from 'nango';

const Person = z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    city: z.string().nullable(),
    company_id: z.string().nullable(),
    avatar_url: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Person = z.infer<typeof Person>;

interface TwentyPeopleResponse {
    data: {
        people: {
            edges: Array<{
                node: {
                    id: string;
                    name: { firstName: string | null; lastName: string | null };
                    emails: { primaryEmail: string | null };
                    phones: { primaryPhoneNumber: string | null };
                    city: string | null;
                    company: { id: string } | null;
                    avatarUrl: string | null;
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
    description: 'Fetches all people (contacts) from Twenty CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/people' }],
    scopes: [],
    models: { Person },
    metadata: z.object({}),

    exec: async (nango) => {
        let cursor: string | null = null;

        do {
            const filter = nango.lastSyncDate
                ? { updatedAt: { gte: nango.lastSyncDate.toISOString() } }
                : undefined;

            const params: Record<string, string> = { limit: '60' };
            if (cursor) params['starting_after'] = cursor;
            if (filter) params['filter'] = JSON.stringify(filter);

            const response = await nango.get<TwentyPeopleResponse>({
                // https://docs.twenty.com/developers/extend/capabilities/apis
                endpoint: '/rest/people',
                params,
                retries: 3
            });

            const people = response.data?.data?.people;
            if (!people) break;

            const records: Person[] = people.edges.map((edge) => ({
                id: edge.node.id,
                first_name: edge.node.name?.firstName ?? null,
                last_name: edge.node.name?.lastName ?? null,
                email: edge.node.emails?.primaryEmail ?? null,
                phone: edge.node.phones?.primaryPhoneNumber ?? null,
                city: edge.node.city ?? null,
                company_id: edge.node.company?.id ?? null,
                avatar_url: edge.node.avatarUrl ?? null,
                created_at: edge.node.createdAt ?? null,
                updated_at: edge.node.updatedAt ?? null
            }));

            await nango.batchSave(records, 'Person');

            cursor = people.pageInfo.hasNextPage ? (people.pageInfo.endCursor ?? null) : null;
        } while (cursor);
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
