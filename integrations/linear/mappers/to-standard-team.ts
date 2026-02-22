import type { LinearTeam } from '../models/index.js';
import type { StandardTeam } from '../models/index.js';

export function toStandardTeam(team: LinearTeam): StandardTeam {
    return {
        id: team.id,
        name: team.name,
        description: team.description ?? null,
        url: null,
        providerSpecific: {},
        createdAt: team.createdAt,
        updatedAt: team.updatedAt
    };
}
