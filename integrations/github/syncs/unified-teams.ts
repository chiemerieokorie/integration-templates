import { createSync } from 'nango';
import type { ProxyConfiguration } from 'nango';
import { toStandardTeam } from '../mappers/to-standard-team.js';
import { StandardTeam } from '../models.js';
import type { GithubTeamRaw } from '../types.js';
import { z } from 'zod';

const LIMIT = 100;

const sync = createSync({
    description: "Fetches GitHub teams from the user's organizations and maps them to the standard team model",
    version: '1.0.0',
    frequency: 'every half hour',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/teams/unified',
            group: 'Unified Team API'
        }
    ],

    scopes: ['read:org'],

    models: {
        StandardTeam: StandardTeam
    },

    metadata: z.object({}),

    exec: async (nango) => {
        const proxyConfig: ProxyConfiguration = {
            // https://docs.github.com/en/rest/teams/teams?apiVersion=2022-11-28#list-teams-for-the-authenticated-user
            endpoint: '/user/teams',
            paginate: { limit: LIMIT }
        };

        for await (const teamBatch of nango.paginate<GithubTeamRaw>(proxyConfig)) {
            const mappedTeams = teamBatch.map(toStandardTeam);

            if (mappedTeams.length > 0) {
                await nango.batchSave(mappedTeams, 'StandardTeam');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
