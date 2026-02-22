import { describe, it, expect } from 'vitest';
import { toStandardProject } from '../mappers/to-standard-project.js';
import type { Project } from '../models/index.js';

const baseProject: Project = {
    id: 'proj-1',
    key: 'PROJ',
    name: 'My Project',
    url: 'https://api.atlassian.net/rest/api/3/project/proj-1',
    projectTypeKey: 'software',
    webUrl: 'https://myorg.atlassian.net/jira/software/projects/PROJ/boards'
};

describe('toStandardProject', () => {
    it('maps id and name correctly', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.id).toBe('proj-1');
        expect(result.name).toBe('My Project');
    });

    it('maps webUrl to url', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.url).toBe('https://myorg.atlassian.net/jira/software/projects/PROJ/boards');
    });

    it('puts key, projectTypeKey, and apiUrl in providerSpecific', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.providerSpecific).toStrictEqual({
            key: 'PROJ',
            projectTypeKey: 'software',
            apiUrl: 'https://api.atlassian.net/rest/api/3/project/proj-1'
        });
    });

    it('always sets status to null', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.status).toBeNull();
    });

    it('uses provided createdAt and updatedAt', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-06-15T08:30:00.000Z');
        expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
        expect(result.updatedAt).toBe('2024-06-15T08:30:00.000Z');
    });

    it('falls back to current time when createdAt/updatedAt are not provided', () => {
        const before = new Date().toISOString();
        const result = toStandardProject(baseProject);
        const after = new Date().toISOString();
        expect(result.createdAt >= before).toBe(true);
        expect(result.createdAt <= after).toBe(true);
        expect(result.updatedAt >= before).toBe(true);
        expect(result.updatedAt <= after).toBe(true);
    });

    it('sets description, ownerId, teamId, startDate, targetDate to null', () => {
        const result = toStandardProject(baseProject, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.description).toBeNull();
        expect(result.ownerId).toBeNull();
        expect(result.teamId).toBeNull();
        expect(result.startDate).toBeNull();
        expect(result.targetDate).toBeNull();
    });
});
