import type { AsanaWorkspace } from '../models/index.js';
import type { StandardTeam } from '../models/index.js';

export function toStandardTeam(workspace: AsanaWorkspace): StandardTeam {
    return {
        id: workspace.gid,
        name: workspace.name,
        description: null,
        url: null,
        providerSpecific: {
            isOrganization: workspace.is_organization
        },
        createdAt: null,
        updatedAt: null
    };
}
