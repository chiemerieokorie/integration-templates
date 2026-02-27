import { z } from 'zod';
import { createSync } from 'nango';

const Company = z.object({
    id: z.string(),
    name: z.string().nullable(),
    domain_name: z.string().nullable(),
    employees: z.number().nullable(),
    city: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

type Company = z.infer<typeof Company>;

interface TwentyCompaniesResponse {
    data: {
        companies: {
            edges: Array<{
                node: {
                    id: string;
                    name: string | null;
                    domainName: { primaryLinkUrl: string | null } | null;
                    employees: number | null;
                    address: { addressCity: string | null } | null;
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
    description: 'Fetches all companies from Twenty CRM',
    version: '1.0.0',
    frequency: 'every hour',
    autoStart: false,
    syncType: 'incremental',

    endpoints: [{ method: 'GET', path: '/companies' }],
    scopes: [],
    models: { Company },
    metadata: z.object({}),

    exec: async (nango) => {
        let cursor: string | null = null;

        do {
            const params: Record<string, string> = { limit: '60' };
            if (cursor) params['starting_after'] = cursor;
            if (nango.lastSyncDate) {
                params['filter'] = JSON.stringify({ updatedAt: { gte: nango.lastSyncDate.toISOString() } });
            }

            const response = await nango.get<TwentyCompaniesResponse>({
                // https://docs.twenty.com/developers/extend/capabilities/apis
                endpoint: '/rest/companies',
                params,
                retries: 3
            });

            const companies = response.data?.data?.companies;
            if (!companies) break;

            const records: Company[] = companies.edges.map((edge) => ({
                id: edge.node.id,
                name: edge.node.name ?? null,
                domain_name: edge.node.domainName?.primaryLinkUrl ?? null,
                employees: edge.node.employees ?? null,
                city: edge.node.address?.addressCity ?? null,
                created_at: edge.node.createdAt ?? null,
                updated_at: edge.node.updatedAt ?? null
            }));

            await nango.batchSave(records, 'Company');

            cursor = companies.pageInfo.hasNextPage ? (companies.pageInfo.endCursor ?? null) : null;
        } while (cursor);
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
