import { describe, it, expect } from 'vitest';
import { toStandardMilestone } from '../mappers/to-standard-milestone.js';
import type { JiraFixVersion } from '../models/index.js';

const pastDate = '2020-01-01';
const futureDate = '2099-12-31';

function makeVersion(overrides: Partial<JiraFixVersion> = {}): JiraFixVersion {
    return {
        id: 'version-1',
        name: 'v1.0',
        description: 'First release',
        archived: false,
        released: false,
        projectId: 'proj-1',
        ...overrides
    };
}

describe('toStandardMilestone', () => {
    it('maps archived: true to status CANCELLED (regardless of released)', () => {
        const version = makeVersion({ archived: true, released: true });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.status).toBe('CANCELLED');
    });

    it('maps released: true, archived: false to status COMPLETED', () => {
        const version = makeVersion({ released: true, archived: false, releaseDate: pastDate });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.status).toBe('COMPLETED');
    });

    it('maps releaseDate in the past, not released, not archived to status ACTIVE', () => {
        const version = makeVersion({ released: false, archived: false, releaseDate: pastDate });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.status).toBe('ACTIVE');
    });

    it('maps releaseDate in the future, not released, not archived to status PLANNED', () => {
        const version = makeVersion({ released: false, archived: false, releaseDate: futureDate });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.status).toBe('PLANNED');
    });

    it('maps no description to null', () => {
        const version = makeVersion({ description: undefined });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.description).toBeNull();
    });

    it('formats startDate as ISO string', () => {
        const version = makeVersion({ startDate: '2024-03-01' });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.startDate).toBe(new Date('2024-03-01').toISOString());
    });

    it('formats releaseDate as targetDate ISO string', () => {
        const version = makeVersion({ releaseDate: '2024-06-30' });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.targetDate).toBe(new Date('2024-06-30').toISOString());
    });

    it('sets completedAt to releaseDate ISO string when released', () => {
        const version = makeVersion({ released: true, releaseDate: '2024-05-15' });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.completedAt).toBe(new Date('2024-05-15').toISOString());
    });

    it('sets completedAt to null when not released', () => {
        const version = makeVersion({ released: false, releaseDate: futureDate });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.completedAt).toBeNull();
    });

    it('uses provided createdAt and updatedAt', () => {
        const version = makeVersion();
        const result = toStandardMilestone(version, '2023-06-01T00:00:00.000Z', '2023-07-01T00:00:00.000Z');
        expect(result.createdAt).toBe('2023-06-01T00:00:00.000Z');
        expect(result.updatedAt).toBe('2023-07-01T00:00:00.000Z');
    });

    it('maps id, name, and projectId correctly', () => {
        const version = makeVersion({ id: 'v-99', name: 'Beta Release', projectId: 'proj-42' });
        const result = toStandardMilestone(version, '2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z');
        expect(result.id).toBe('v-99');
        expect(result.name).toBe('Beta Release');
        expect(result.projectId).toBe('proj-42');
    });
});
