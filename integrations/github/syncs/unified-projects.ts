import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { toStandardProject } from '../mappers/to-standard-project.js';
import { StandardProject } from '../models.js';
import { z } from 'zod';

const LIMIT = 100;

interface GithubRepoFull {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    archived: boolean;
    owner: { id: number; login: string };
    created_at: string;
    updated_at: string;
}

const sync = createSync({
    description: "Fetches GitHub repositories for the authenticated user and maps them to the standard project model",
    version: '1.0.0',
    frequency: 'every half hour',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/projects/unified',
            group: 'Unified Project API'
        }
    ],

    scopes: ['repo'],

    models: {
        StandardProject: StandardProject
    },

    metadata: z.object({}),

    exec: async (nango) => {
        const proxyConfig: ProxyConfiguration = {
            // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user
            endpoint: '/user/repos',
            paginate: { limit: LIMIT }
        };

        for await (const repoBatch of nango.paginate<GithubRepoFull>(proxyConfig)) {
            const mappedProjects = repoBatch.map(toStandardProject);

            if (mappedProjects.length > 0) {
                await nango.batchSave(mappedProjects, 'StandardProject');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
