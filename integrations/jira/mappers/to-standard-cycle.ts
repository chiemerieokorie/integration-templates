import type { JiraSprint } from '../models/index.js';
import type { StandardCycle } from '../models/index.js';

const STATE_MAP: Record<JiraSprint['state'], StandardCycle['status']> = {
    future: 'PLANNED',
    active: 'ACTIVE',
    closed: 'COMPLETED'
};

export function toStandardCycle(sprint: JiraSprint, projectId?: string): StandardCycle {
    return {
        id: String(sprint.id),
        name: sprint.name,
        description: null,
        number: sprint.id,
        status: STATE_MAP[sprint.state],
        teamId: projectId ?? null,
        startDate: sprint.startDate ? new Date(sprint.startDate).toISOString() : null,
        endDate: sprint.endDate ? new Date(sprint.endDate).toISOString() : null,
        completedAt: sprint.completeDate ? new Date(sprint.completeDate).toISOString() : null,
        progress: null,
        providerSpecific: {
            originBoardId: sprint.originBoardId,
            goal: sprint.goal ?? null
        },
        createdAt: null,
        updatedAt: null
    };
}
