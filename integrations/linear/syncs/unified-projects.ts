import { createSync } from 'nango';
import { toStandardProject } from '../mappers/to-standard-project.js';
import { StandardProject } from '../models.js';
import { z } from 'zod';

const sync = createSync({
    description: 'Fetches projects from Linear and maps them to the standard project model',
    version: '1.0.0',
    frequency: 'every 5min',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/projects/unified',
            group: 'Unified Project API'
        }
    ],

    models: {
        StandardProject: StandardProject
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
                projects (first: ${pageSize}${afterParam}${filterParam}) {
                    nodes {
                        id
                        name
                        url
                        description
                        teams {
                            nodes {
                                id
                            }
                        }
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

            const nodes = response.data.data.projects.nodes;

            await nango.batchSave(nodes.map(toStandardProject), 'StandardProject');

            if (!response.data.data.projects.pageInfo.hasNextPage || !response.data.data.projects.pageInfo.endCursor) {
                break;
            } else {
                after = response.data.data.projects.pageInfo.endCursor;
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
