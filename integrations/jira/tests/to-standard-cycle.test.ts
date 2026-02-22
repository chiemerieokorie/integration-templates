import { describe, it, expect } from 'vitest';
import { toStandardCycle } from '../mappers/to-standard-cycle.js';
import type { JiraSprint } from '../models/index.js';

function makeSprint(overrides: Partial<JiraSprint> = {}): JiraSprint {
    return {
        id: 1,
        name: 'Sprint 1',
        state: 'future',
        originBoardId: 10,
        ...overrides
    };
}

describe('toStandardCycle', () => {
    it('maps state "future" to status PLANNED', () => {
        const result = toStandardCycle(makeSprint({ state: 'future' }));
        expect(result.status).toBe('PLANNED');
    });

    it('maps state "active" to status ACTIVE', () => {
        const result = toStandardCycle(makeSprint({ state: 'active' }));
        expect(result.status).toBe('ACTIVE');
    });

    it('maps state "closed" to status COMPLETED', () => {
        const result = toStandardCycle(makeSprint({ state: 'closed' }));
        expect(result.status).toBe('COMPLETED');
    });

    it('converts numeric id to string', () => {
        const result = toStandardCycle(makeSprint({ id: 42 }));
        expect(result.id).toBe('42');
        expect(typeof result.id).toBe('string');
    });

    it('sets number to the numeric sprint id', () => {
        const result = toStandardCycle(makeSprint({ id: 7 }));
        expect(result.number).toBe(7);
    });

    it('formats startDate and endDate as ISO strings', () => {
        const sprint = makeSprint({
            state: 'active',
            startDate: '2024-02-01T09:00:00.000Z',
            endDate: '2024-02-14T09:00:00.000Z'
        });
        const result = toStandardCycle(sprint);
        expect(result.startDate).toBe(new Date('2024-02-01T09:00:00.000Z').toISOString());
        expect(result.endDate).toBe(new Date('2024-02-14T09:00:00.000Z').toISOString());
    });

    it('maps completeDate to completedAt as ISO string', () => {
        const sprint = makeSprint({
            state: 'closed',
            completeDate: '2024-02-14T17:00:00.000Z'
        });
        const result = toStandardCycle(sprint);
        expect(result.completedAt).toBe(new Date('2024-02-14T17:00:00.000Z').toISOString());
    });

    it('sets startDate, endDate, completedAt to null when missing', () => {
        const result = toStandardCycle(makeSprint());
        expect(result.startDate).toBeNull();
        expect(result.endDate).toBeNull();
        expect(result.completedAt).toBeNull();
    });

    it('puts originBoardId and goal in providerSpecific', () => {
        const sprint = makeSprint({ originBoardId: 55, goal: 'Ship the feature' });
        const result = toStandardCycle(sprint);
        expect(result.providerSpecific).toStrictEqual({
            originBoardId: 55,
            goal: 'Ship the feature'
        });
    });

    it('sets goal to null in providerSpecific when not provided', () => {
        const sprint = makeSprint({ originBoardId: 10, goal: undefined });
        const result = toStandardCycle(sprint);
        expect(result.providerSpecific.goal).toBeNull();
    });

    it('maps projectId parameter to teamId', () => {
        const result = toStandardCycle(makeSprint(), 'proj-123');
        expect(result.teamId).toBe('proj-123');
    });

    it('sets teamId to null when projectId not provided', () => {
        const result = toStandardCycle(makeSprint());
        expect(result.teamId).toBeNull();
    });

    it('sets createdAt and updatedAt to null', () => {
        const result = toStandardCycle(makeSprint());
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });
});
