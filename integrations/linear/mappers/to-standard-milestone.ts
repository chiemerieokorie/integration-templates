import type { LinearMilestone } from '../models/index.js';
import type { StandardMilestone } from '../models/index.js';

const STATUS_MAP: Record<string, StandardMilestone['status']> = {
    planned: 'PLANNED',
    active: 'ACTIVE',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED'
};

export function toStandardMilestone(milestone: LinearMilestone): StandardMilestone {
    return {
        id: milestone.id,
        name: milestone.name,
        description: milestone.description ?? null,
        status: STATUS_MAP[milestone.status.toLowerCase()] ?? null,
        projectId: milestone.project.id,
        startDate: null,
        targetDate: null,
        completedAt: null,
        progress: milestone.progress,
        providerSpecific: {
            projectName: milestone.project.name
        },
        createdAt: milestone.createdAt,
        updatedAt: milestone.updatedAt
    };
}
