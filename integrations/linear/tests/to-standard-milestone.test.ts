import { describe, it, expect } from 'vitest';
import { toStandardMilestone } from '../mappers/to-standard-milestone.js';
import type { LinearMilestone } from '../models/index.js';

function makeMilestone(overrides: Partial<LinearMilestone> = {}): LinearMilestone {
    return {
        id: 'milestone-1',
        name: 'Q1 Release',
        description: 'First quarter release milestone',
        progress: 0.75,
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z',
        project: {
            id: 'project-1',
            name: 'My Project'
        },
        ...overrides
    };
}

describe('toStandardMilestone', () => {
    it('maps status "planned" to PLANNED', () => {
        const milestone = makeMilestone({ status: 'planned' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBe('PLANNED');
    });

    it('maps status "active" to ACTIVE', () => {
        const milestone = makeMilestone({ status: 'active' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBe('ACTIVE');
    });

    it('maps status "completed" to COMPLETED', () => {
        const milestone = makeMilestone({ status: 'completed' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBe('COMPLETED');
    });

    it('maps status "cancelled" to CANCELLED', () => {
        const milestone = makeMilestone({ status: 'cancelled' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBe('CANCELLED');
    });

    it('maps unknown status to null', () => {
        const milestone = makeMilestone({ status: 'unknown_status' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBeNull();
    });

    it('maps uppercase status to correct enum value (case-insensitive)', () => {
        const milestone = makeMilestone({ status: 'ACTIVE' });
        const result = toStandardMilestone(milestone);
        expect(result.status).toBe('ACTIVE');
    });

    it('passes through progress value', () => {
        const milestone = makeMilestone({ progress: 0.42 });
        const result = toStandardMilestone(milestone);
        expect(result.progress).toBe(0.42);
    });

    it('sets projectId from project.id', () => {
        const milestone = makeMilestone({ project: { id: 'proj-xyz', name: 'XYZ' } });
        const result = toStandardMilestone(milestone);
        expect(result.projectId).toBe('proj-xyz');
    });

    it('includes projectName in providerSpecific', () => {
        const milestone = makeMilestone({ project: { id: 'proj-1', name: 'Alpha Project' } });
        const result = toStandardMilestone(milestone);
        expect(result.providerSpecific).toMatchObject({ projectName: 'Alpha Project' });
    });

    it('maps a full milestone to StandardMilestone correctly', () => {
        const milestone = makeMilestone();
        const result = toStandardMilestone(milestone);

        expect(result).toStrictEqual({
            id: 'milestone-1',
            name: 'Q1 Release',
            description: 'First quarter release milestone',
            status: 'ACTIVE',
            projectId: 'project-1',
            startDate: null,
            targetDate: null,
            completedAt: null,
            progress: 0.75,
            providerSpecific: { projectName: 'My Project' },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-03-01T00:00:00.000Z'
        });
    });

    it('maps null description to null', () => {
        const milestone = makeMilestone({ description: null });
        const result = toStandardMilestone(milestone);
        expect(result.description).toBeNull();
    });
});
