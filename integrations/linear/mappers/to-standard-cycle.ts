import type { LinearCycle } from '../models/index.js';
import type { StandardCycle } from '../models/index.js';

function mapCycleStatus(cycle: LinearCycle): StandardCycle['status'] {
    if (cycle.completedAt) return 'COMPLETED';
    const now = Date.now();
    const starts = new Date(cycle.startsAt).getTime();
    const ends = new Date(cycle.endsAt).getTime();
    if (starts > now) return 'PLANNED';
    if (starts <= now && ends >= now) return 'ACTIVE';
    return 'COMPLETED';
}

export function toStandardCycle(cycle: LinearCycle): StandardCycle {
    return {
        id: cycle.id,
        name: cycle.name,
        description: cycle.description ?? null,
        number: cycle.number,
        status: mapCycleStatus(cycle),
        teamId: cycle.team.id,
        startDate: new Date(cycle.startsAt).toISOString(),
        endDate: new Date(cycle.endsAt).toISOString(),
        completedAt: cycle.completedAt ? new Date(cycle.completedAt).toISOString() : null,
        progress: Math.round(cycle.progress * 100),
        providerSpecific: {},
        createdAt: new Date(cycle.createdAt).toISOString(),
        updatedAt: new Date(cycle.updatedAt).toISOString()
    };
}
