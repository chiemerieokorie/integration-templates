import type { LinearProject } from '../models/index.js';
import type { StandardProject } from '../models/index.js';

export function toStandardProject(project: LinearProject): StandardProject {
    return {
        id: project.id,
        name: project.name,
        description: project.description ?? null,
        status: null,
        startDate: null,
        targetDate: null,
        ownerId: null,
        teamId: project.teamId,
        url: project.url,
        providerSpecific: {},
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
    };
}
