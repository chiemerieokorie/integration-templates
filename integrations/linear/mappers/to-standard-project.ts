import type { StandardProject } from '../models/index.js';

interface LinearProjectResponse {
    id: string;
    name: string;
    description: string | null;
    url: string;
    teams?: { nodes: { id: string }[] };
    createdAt: string;
    updatedAt: string;
}

export function toStandardProject(project: LinearProjectResponse): StandardProject {
    return {
        id: project.id,
        name: project.name,
        description: project.description ?? null,
        status: null,
        startDate: null,
        targetDate: null,
        ownerId: null,
        teamId: project.teams?.nodes?.[0]?.id ?? null,
        url: project.url,
        providerSpecific: {},
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
    };
}
