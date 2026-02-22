import type { Project } from '../models/index.js';
import type { StandardProject } from '../models/index.js';

export function toStandardProject(project: Project, createdAt?: string, updatedAt?: string): StandardProject {
    return {
        id: project.id,
        name: project.name,
        description: null,
        status: null,
        startDate: null,
        targetDate: null,
        ownerId: null,
        teamId: null,
        url: project.webUrl,
        providerSpecific: {
            key: project.key,
            projectTypeKey: project.projectTypeKey,
            apiUrl: project.url
        },
        createdAt: createdAt ?? null,
        updatedAt: updatedAt ?? null
    };
}
