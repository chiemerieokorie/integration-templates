import type { JiraFixVersion } from '../models/index.js';
import type { StandardMilestone } from '../models/index.js';

function mapStatus(version: JiraFixVersion): StandardMilestone['status'] {
    if (version.archived) return 'CANCELLED';
    if (version.released) return 'COMPLETED';
    if (version.releaseDate && new Date(version.releaseDate) < new Date()) return 'ACTIVE';
    return 'PLANNED';
}

export function toStandardMilestone(version: JiraFixVersion, createdAt?: string, updatedAt?: string): StandardMilestone {
    return {
        id: version.id,
        name: version.name,
        description: version.description ?? null,
        status: mapStatus(version),
        projectId: version.projectId,
        startDate: version.startDate ? new Date(version.startDate).toISOString() : null,
        targetDate: version.releaseDate ? new Date(version.releaseDate).toISOString() : null,
        completedAt: version.released && version.releaseDate ? new Date(version.releaseDate).toISOString() : null,
        progress: null,
        providerSpecific: {
            released: version.released,
            archived: version.archived
        },
        createdAt: createdAt ?? null,
        updatedAt: updatedAt ?? null
    };
}
