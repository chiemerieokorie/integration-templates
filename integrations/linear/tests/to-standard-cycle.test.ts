import { describe, it, expect } from 'vitest';
import { toStandardCycle } from '../mappers/to-standard-cycle.js';
import type { LinearCycle } from '../models/index.js';

// Dates relative to 2026-02-22 (current date)
const PAST_DATE = '2024-01-01T00:00:00.000Z';
const NEAR_PAST_DATE = '2026-01-01T00:00:00.000Z';
const NEAR_FUTURE_DATE = '2027-12-31T23:59:59.000Z';
const FAR_FUTURE_DATE = '2028-06-01T00:00:00.000Z';

function makeCycle(overrides: Partial<LinearCycle> = {}): LinearCycle {
    return {
        id: 'cycle-1',
        name: 'Cycle 1',
        description: 'First cycle',
        number: 1,
        startsAt: NEAR_PAST_DATE,
        endsAt: NEAR_FUTURE_DATE,
        completedAt: null,
        progress: 0.5,
        team: { id: 'team-1' },
        createdAt: PAST_DATE,
        updatedAt: PAST_DATE,
        ...overrides
    };
}

describe('toStandardCycle', () => {
    it('maps to COMPLETED when completedAt is set', () => {
        const cycle = makeCycle({ completedAt: '2024-05-30T00:00:00.000Z' });
        const result = toStandardCycle(cycle);
        expect(result.status).toBe('COMPLETED');
    });

    it('maps to PLANNED when startsAt is in the future', () => {
        const cycle = makeCycle({
            startsAt: FAR_FUTURE_DATE,
            endsAt: '2029-01-01T00:00:00.000Z',
            completedAt: null
        });
        const result = toStandardCycle(cycle);
        expect(result.status).toBe('PLANNED');
    });

    it('maps to ACTIVE when startsAt is past and endsAt is in the future', () => {
        const cycle = makeCycle({
            startsAt: NEAR_PAST_DATE,
            endsAt: NEAR_FUTURE_DATE,
            completedAt: null
        });
        const result = toStandardCycle(cycle);
        expect(result.status).toBe('ACTIVE');
    });

    it('maps lapsed cycle (both dates past, no completedAt) to COMPLETED', () => {
        const cycle = makeCycle({
            startsAt: '2023-01-01T00:00:00.000Z',
            endsAt: '2023-03-31T00:00:00.000Z',
            completedAt: null
        });
        const result = toStandardCycle(cycle);
        expect(result.status).toBe('COMPLETED');
    });

    it('multiplies progress by 100 and rounds', () => {
        const cycle = makeCycle({ progress: 0.756 });
        const result = toStandardCycle(cycle);
        expect(result.progress).toBe(76);
    });

    it('rounds progress correctly for 0.5', () => {
        const cycle = makeCycle({ progress: 0.5 });
        const result = toStandardCycle(cycle);
        expect(result.progress).toBe(50);
    });

    it('rounds progress correctly for 0.999', () => {
        const cycle = makeCycle({ progress: 0.999 });
        const result = toStandardCycle(cycle);
        expect(result.progress).toBe(100);
    });

    it('maps completedAt to ISO string when set', () => {
        const cycle = makeCycle({ completedAt: '2024-05-30T00:00:00.000Z' });
        const result = toStandardCycle(cycle);
        expect(result.completedAt).toBe(new Date('2024-05-30T00:00:00.000Z').toISOString());
    });

    it('maps null completedAt to null', () => {
        const cycle = makeCycle({ completedAt: null });
        const result = toStandardCycle(cycle);
        expect(result.completedAt).toBeNull();
    });

    it('maps teamId from team.id', () => {
        const cycle = makeCycle({ team: { id: 'team-xyz' } });
        const result = toStandardCycle(cycle);
        expect(result.teamId).toBe('team-xyz');
    });

    it('maps a full cycle to StandardCycle correctly', () => {
        const cycle = makeCycle({
            startsAt: NEAR_PAST_DATE,
            endsAt: NEAR_FUTURE_DATE,
            completedAt: null,
            progress: 0.5
        });
        const result = toStandardCycle(cycle);

        expect(result).toStrictEqual({
            id: 'cycle-1',
            name: 'Cycle 1',
            description: 'First cycle',
            number: 1,
            status: 'ACTIVE',
            teamId: 'team-1',
            startDate: new Date(NEAR_PAST_DATE).toISOString(),
            endDate: new Date(NEAR_FUTURE_DATE).toISOString(),
            completedAt: null,
            progress: 50,
            providerSpecific: {},
            createdAt: new Date(PAST_DATE).toISOString(),
            updatedAt: new Date(PAST_DATE).toISOString()
        });
    });

    it('maps null description to null', () => {
        const cycle = makeCycle({ description: null });
        const result = toStandardCycle(cycle);
        expect(result.description).toBeNull();
    });
});
