import { describe, it, expect } from 'vitest';
import { toStandardProject } from '../mappers/to-standard-project.js';
import type { LinearProject } from '../models/index.js';

function makeProject(overrides: Partial<LinearProject> = {}): LinearProject {
    return {
        id: 'project-1',
        name: 'My Project',
        description: 'A great project',
        url: 'https://linear.app/team/project/my-project',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-06-01T00:00:00.000Z',
        teamId: 'team-1',
        ...overrides
    };
}

describe('toStandardProject', () => {
    it('maps a full project to StandardProject correctly', () => {
        const project = makeProject();
        const result = toStandardProject(project);

        expect(result).toStrictEqual({
            id: 'project-1',
            name: 'My Project',
            description: 'A great project',
            status: null,
            startDate: null,
            targetDate: null,
            ownerId: null,
            teamId: 'team-1',
            url: 'https://linear.app/team/project/my-project',
            providerSpecific: {},
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-06-01T00:00:00.000Z'
        });
    });

    it('maps null description to null', () => {
        const project = makeProject({ description: null });
        const result = toStandardProject(project);
        expect(result.description).toBeNull();
    });

    it('propagates teamId correctly', () => {
        const project = makeProject({ teamId: 'team-xyz' });
        const result = toStandardProject(project);
        expect(result.teamId).toBe('team-xyz');
    });

    it('always sets status, startDate, targetDate, ownerId to null', () => {
        const project = makeProject();
        const result = toStandardProject(project);
        expect(result.status).toBeNull();
        expect(result.startDate).toBeNull();
        expect(result.targetDate).toBeNull();
        expect(result.ownerId).toBeNull();
    });

    it('sets providerSpecific to empty object', () => {
        const project = makeProject();
        const result = toStandardProject(project);
        expect(result.providerSpecific).toStrictEqual({});
    });

    it('maps url correctly', () => {
        const project = makeProject({ url: 'https://linear.app/org/project/p-42' });
        const result = toStandardProject(project);
        expect(result.url).toBe('https://linear.app/org/project/p-42');
    });

    it('preserves createdAt and updatedAt timestamps', () => {
        const project = makeProject({
            createdAt: '2023-05-15T08:30:00.000Z',
            updatedAt: '2024-11-20T12:00:00.000Z'
        });
        const result = toStandardProject(project);
        expect(result.createdAt).toBe('2023-05-15T08:30:00.000Z');
        expect(result.updatedAt).toBe('2024-11-20T12:00:00.000Z');
    });
});
