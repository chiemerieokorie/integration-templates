import { describe, it, expect } from 'vitest';
import { toStandardMilestone } from '../mappers/to-standard-milestone.js';

const baseMilestone = {
    id: 4001,
    number: 3,
    title: 'v2.0 Release',
    description: 'Major release with new features',
    state: 'open' as const,
    due_on: '2024-12-31T07:00:00Z',
    closed_at: null,
    open_issues: 11,
    closed_issues: 9,
    html_url: 'https://github.com/octocat/hello-world/milestone/3',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z'
};

describe('toStandardMilestone', () => {
    it('maps state "open" to status ACTIVE', () => {
        const result = toStandardMilestone({ ...baseMilestone, state: 'open' }, 'octocat', 'hello-world');
        expect(result.status).toBe('ACTIVE');
    });

    it('maps state "closed" to status COMPLETED', () => {
        const result = toStandardMilestone({ ...baseMilestone, state: 'closed' }, 'octocat', 'hello-world');
        expect(result.status).toBe('COMPLETED');
    });

    it('maps due_on to targetDate as ISO string when present', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result.targetDate).toBe(new Date('2024-12-31T07:00:00Z').toISOString());
    });

    it('sets targetDate to null when due_on is null', () => {
        const result = toStandardMilestone({ ...baseMilestone, due_on: null }, 'octocat', 'hello-world');
        expect(result.targetDate).toBeNull();
    });

    it('maps closed_at to completedAt when present', () => {
        const result = toStandardMilestone(
            { ...baseMilestone, state: 'closed', closed_at: '2024-09-30T10:00:00Z' },
            'octocat',
            'hello-world'
        );
        expect(result.completedAt).toBe(new Date('2024-09-30T10:00:00Z').toISOString());
    });

    it('sets completedAt to null when closed_at is null', () => {
        const result = toStandardMilestone({ ...baseMilestone, closed_at: null }, 'octocat', 'hello-world');
        expect(result.completedAt).toBeNull();
    });

    it('calculates progress: 9 closed, 11 open -> 45', () => {
        const result = toStandardMilestone(
            { ...baseMilestone, closed_issues: 9, open_issues: 11 },
            'octocat',
            'hello-world'
        );
        expect(result.progress).toBe(45);
    });

    it('sets progress to null when total issues is 0', () => {
        const result = toStandardMilestone(
            { ...baseMilestone, open_issues: 0, closed_issues: 0 },
            'octocat',
            'hello-world'
        );
        expect(result.progress).toBeNull();
    });

    it('converts numeric id to string', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result.id).toBe('4001');
    });

    it('sets projectId as owner/repo', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result.projectId).toBe('octocat/hello-world');
    });

    it('sets startDate to null', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result.startDate).toBeNull();
    });

    it('includes number, htmlUrl, openIssues, closedIssues in providerSpecific', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result.providerSpecific).toStrictEqual({
            number: 3,
            htmlUrl: 'https://github.com/octocat/hello-world/milestone/3',
            openIssues: 11,
            closedIssues: 9
        });
    });

    it('returns a fully mapped StandardMilestone object', () => {
        const result = toStandardMilestone(baseMilestone, 'octocat', 'hello-world');
        expect(result).toStrictEqual({
            id: '4001',
            name: 'v2.0 Release',
            description: 'Major release with new features',
            status: 'ACTIVE',
            projectId: 'octocat/hello-world',
            startDate: null,
            targetDate: new Date('2024-12-31T07:00:00Z').toISOString(),
            completedAt: null,
            progress: 45,
            providerSpecific: {
                number: 3,
                htmlUrl: 'https://github.com/octocat/hello-world/milestone/3',
                openIssues: 11,
                closedIssues: 9
            },
            createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
            updatedAt: new Date('2024-06-01T00:00:00Z').toISOString()
        });
    });

    it('calculates progress: 100 closed, 0 open -> 100', () => {
        const result = toStandardMilestone(
            { ...baseMilestone, closed_issues: 100, open_issues: 0 },
            'octocat',
            'hello-world'
        );
        expect(result.progress).toBe(100);
    });

    it('sets description to null when description is null', () => {
        const result = toStandardMilestone({ ...baseMilestone, description: null }, 'octocat', 'hello-world');
        expect(result.description).toBeNull();
    });
});
