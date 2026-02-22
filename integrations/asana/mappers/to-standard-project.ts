import type { AsanaProject } from '../models/index.js';
import type { StandardProject } from '../models/index.js';

export function toStandardProject(project: AsanaProject, createdAt?: string, updatedAt?: string): StandardProject {
    const now = new Date().toISOString();
    return {
        id: project.gid,
        name: project.name,
        description: null,
        status: null,
        startDate: null,
        targetDate: null,
        ownerId: null,
        teamId: null,
        url: null,
        providerSpecific: {
            resourceType: project.resource_type
        },
        createdAt: createdAt ?? now,
        updatedAt: updatedAt ?? now
    };
}
