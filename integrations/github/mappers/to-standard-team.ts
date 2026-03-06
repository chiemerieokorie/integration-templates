import type { StandardTeam } from '../models/index.js';
import type { GithubTeamRaw } from '../types.js';

export function toStandardTeam(team: GithubTeamRaw): StandardTeam {
    return {
        id: team.id.toString(),
        name: team.name,
        description: team.description ?? null,
        url: team.html_url,
        providerSpecific: {
            slug: team.slug,
            org: team.organization.login
        },
        createdAt: new Date(team.created_at).toISOString(),
        updatedAt: new Date(team.updated_at).toISOString()
    };
}
