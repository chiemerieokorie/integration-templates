import { createSync } from 'nango';
import { toStandardTeam } from '../mappers/to-standard-team.js';
import { StandardTeam } from '../models.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches teams from Linear and maps them to the standard team model',
    version: '1.0.0',
    frequency: 'every 5min',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/teams/unified',
            group: 'Unified Team API'
        }
    ],

    models: {
        StandardTeam: StandardTeam
    },

    metadata: z.object({}),

    exec: async (nango) => {
        const { lastSyncDate } = nango;
        const pageSize = 50;
        let after = '';

        // eslint-disable-next-line @nangohq/custom-integrations-linting/no-while-true
        while (true) {
            const filterParam = lastSyncDate
                ? `
            , filter: {
                updatedAt: { gte: "${lastSyncDate.toISOString()}" }
            }`
                : '';

            const afterParam = after ? `, after: "${after}"` : '';

            const query = `
            query {
                teams (first: ${pageSize}${afterParam}${filterParam}) {
                    nodes {
                        id
                        name
                        description
                        createdAt
                        updatedAt
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`;

            const response = await nango.post({
                endpoint: '/graphql',
                data: { query },
                retries: 10
            });

            const nodes = response.data.data.teams.nodes;

            await nango.batchSave(nodes.map(toStandardTeam), 'StandardTeam');

            if (!response.data.data.teams.pageInfo.hasNextPage || !response.data.data.teams.pageInfo.endCursor) {
                break;
            } else {
                after = response.data.data.teams.pageInfo.endCursor;
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
