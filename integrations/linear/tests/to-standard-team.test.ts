import { describe, it, expect } from 'vitest';
import { toStandardTeam } from '../mappers/to-standard-team.js';
import type { LinearTeam } from '../models/index.js';

function makeTeam(overrides: Partial<LinearTeam> = {}): LinearTeam {
    return {
        id: 'team-1',
        name: 'Engineering',
        description: 'The engineering team',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        ...overrides
    };
}

describe('toStandardTeam', () => {
    it('maps a full team to StandardTeam correctly', () => {
        const team = makeTeam();
        const result = toStandardTeam(team);

        expect(result).toStrictEqual({
            id: 'team-1',
            name: 'Engineering',
            description: 'The engineering team',
            url: null,
            providerSpecific: {},
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        });
    });

    it('maps null description to null', () => {
        const team = makeTeam({ description: null });
        const result = toStandardTeam(team);
        expect(result.description).toBeNull();
    });

    it('always sets url to null (Linear teams have no public URL in this model)', () => {
        const team = makeTeam();
        const result = toStandardTeam(team);
        expect(result.url).toBeNull();
    });

    it('sets providerSpecific to empty object', () => {
        const team = makeTeam();
        const result = toStandardTeam(team);
        expect(result.providerSpecific).toStrictEqual({});
    });

    it('preserves id and name', () => {
        const team = makeTeam({ id: 'team-abc', name: 'Design' });
        const result = toStandardTeam(team);
        expect(result.id).toBe('team-abc');
        expect(result.name).toBe('Design');
    });

    it('preserves createdAt and updatedAt timestamps', () => {
        const team = makeTeam({
            createdAt: '2022-06-10T09:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z'
        });
        const result = toStandardTeam(team);
        expect(result.createdAt).toBe('2022-06-10T09:00:00.000Z');
        expect(result.updatedAt).toBe('2025-01-01T00:00:00.000Z');
    });
});
