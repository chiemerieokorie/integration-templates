import { describe, it, expect } from 'vitest';
import { toStandardProject } from '../mappers/to-standard-project.js';
import type { AsanaProject } from '../models/index.js';

function makeProject(overrides: Partial<AsanaProject> = {}): AsanaProject {
    return {
        gid: 'proj-gid-1',
        resource_type: 'project',
        name: 'My Project',
        id: 'proj-id-1',
        ...overrides
    };
}

describe('toStandardProject', () => {
    it('maps gid to id', () => {
        const project = makeProject({ gid: 'proj-gid-42' });
        const result = toStandardProject(project, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.id).toBe('proj-gid-42');
    });

    it('maps name correctly', () => {
        const project = makeProject({ name: 'Sprint Planning' });
        const result = toStandardProject(project, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');
        expect(result.name).toBe('Sprint Planning');
    });

    it('sets all nullable/missing fields to null', () => {
        const project = makeProject();
        const result = toStandardProject(project, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');
        expect(result.description).toBeNull();
        expect(result.status).toBeNull();
        expect(result.startDate).toBeNull();
        expect(result.targetDate).toBeNull();
        expect(result.ownerId).toBeNull();
        expect(result.teamId).toBeNull();
        expect(result.url).toBeNull();
    });

    it('puts resource_type in providerSpecific', () => {
        const project = makeProject({ resource_type: 'project' });
        const result = toStandardProject(project, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');
        expect(result.providerSpecific).toStrictEqual({ resourceType: 'project' });
    });

    it('uses provided createdAt and updatedAt timestamps', () => {
        const project = makeProject();
        const result = toStandardProject(project, '2024-02-01T00:00:00.000Z', '2024-03-01T00:00:00.000Z');
        expect(result.createdAt).toBe('2024-02-01T00:00:00.000Z');
        expect(result.updatedAt).toBe('2024-03-01T00:00:00.000Z');
    });

    it('falls back to a current timestamp when createdAt/updatedAt are not provided', () => {
        const before = Date.now();
        const project = makeProject();
        const result = toStandardProject(project);
        const after = Date.now();
        const createdMs = new Date(result.createdAt).getTime();
        const updatedMs = new Date(result.updatedAt).getTime();
        expect(createdMs).toBeGreaterThanOrEqual(before);
        expect(createdMs).toBeLessThanOrEqual(after);
        expect(updatedMs).toBeGreaterThanOrEqual(before);
        expect(updatedMs).toBeLessThanOrEqual(after);
    });

    it('maps the full project correctly', () => {
        const project = makeProject({
            gid: 'gid-full-proj',
            name: 'Full Project',
            resource_type: 'project',
            id: 'id-full-proj'
        });
        const result = toStandardProject(project, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result).toStrictEqual({
            id: 'gid-full-proj',
            name: 'Full Project',
            description: null,
            status: null,
            startDate: null,
            targetDate: null,
            ownerId: null,
            teamId: null,
            url: null,
            providerSpecific: { resourceType: 'project' },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
        });
    });
});
