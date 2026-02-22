import { describe, it, expect } from 'vitest';
import { toStandardProject } from '../mappers/to-standard-project.js';

const baseRepo = {
    id: 123456,
    name: 'hello-world',
    full_name: 'octocat/hello-world',
    description: 'A test repository',
    html_url: 'https://github.com/octocat/hello-world',
    archived: false,
    owner: { id: 1, login: 'octocat' },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-06-15T08:30:00Z'
};

describe('toStandardProject', () => {
    it('maps a non-archived repo to status ACTIVE', () => {
        const result = toStandardProject({ ...baseRepo, archived: false });
        expect(result.status).toBe('ACTIVE');
    });

    it('maps an archived repo to status COMPLETED', () => {
        const result = toStandardProject({ ...baseRepo, archived: true });
        expect(result.status).toBe('COMPLETED');
    });

    it('sets description to null when repo description is null', () => {
        const result = toStandardProject({ ...baseRepo, description: null });
        expect(result.description).toBeNull();
    });

    it('maps description when present', () => {
        const result = toStandardProject(baseRepo);
        expect(result.description).toBe('A test repository');
    });

    it('sets id as owner/repo slug', () => {
        const result = toStandardProject(baseRepo);
        expect(result.id).toBe('octocat/hello-world');
    });

    it('sets ownerId as owner.id converted to string', () => {
        const result = toStandardProject({ ...baseRepo, owner: { id: 42, login: 'octocat' } });
        expect(result.ownerId).toBe('42');
    });

    it('includes fullName in providerSpecific', () => {
        const result = toStandardProject(baseRepo);
        expect(result.providerSpecific).toStrictEqual({
            fullName: 'octocat/hello-world',
            owner: 'octocat',
            repo: 'hello-world'
        });
    });

    it('sets url to html_url', () => {
        const result = toStandardProject(baseRepo);
        expect(result.url).toBe('https://github.com/octocat/hello-world');
    });

    it('sets startDate and targetDate to null', () => {
        const result = toStandardProject(baseRepo);
        expect(result.startDate).toBeNull();
        expect(result.targetDate).toBeNull();
    });

    it('sets teamId to null', () => {
        const result = toStandardProject(baseRepo);
        expect(result.teamId).toBeNull();
    });

    it('returns a fully mapped StandardProject object', () => {
        const result = toStandardProject(baseRepo);
        expect(result).toStrictEqual({
            id: 'octocat/hello-world',
            name: 'hello-world',
            description: 'A test repository',
            status: 'ACTIVE',
            startDate: null,
            targetDate: null,
            ownerId: '1',
            teamId: null,
            url: 'https://github.com/octocat/hello-world',
            providerSpecific: {
                fullName: 'octocat/hello-world',
                owner: 'octocat',
                repo: 'hello-world'
            },
            createdAt: new Date('2023-01-01T00:00:00Z').toISOString(),
            updatedAt: new Date('2024-06-15T08:30:00Z').toISOString()
        });
    });
});
