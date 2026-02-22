import { describe, it, expect } from 'vitest';
import { toStandardTask } from '../mappers/to-standard-task.js';

const baseIssue = {
    id: 1001,
    number: 42,
    title: 'Fix the bug',
    body: 'This is the description',
    state: 'open',
    html_url: 'https://github.com/octocat/hello-world/issues/42',
    user: { id: 201, login: 'octocat' },
    assignee: { id: 301, login: 'contributor' },
    labels: [{ id: 10, name: 'bug' }, { id: 11, name: 'urgent' }],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T12:00:00Z'
};

describe('toStandardTask', () => {
    it('maps an open issue to status TODO', () => {
        const result = toStandardTask({ ...baseIssue, state: 'open' }, 'octocat', 'hello-world');
        expect(result.status).toBe('TODO');
    });

    it('maps a closed issue to status DONE', () => {
        const result = toStandardTask({ ...baseIssue, state: 'closed' }, 'octocat', 'hello-world');
        expect(result.status).toBe('DONE');
    });

    it('always sets priority to NONE', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.priority).toBe('NONE');
    });

    it('maps assignee id to string when assignee is present', () => {
        const result = toStandardTask({ ...baseIssue, assignee: { id: 301, login: 'contributor' } }, 'octocat', 'hello-world');
        expect(result.assigneeId).toBe('301');
    });

    it('sets assigneeId to null when no assignee', () => {
        const result = toStandardTask({ ...baseIssue, assignee: null }, 'octocat', 'hello-world');
        expect(result.assigneeId).toBeNull();
    });

    it('maps user id to creatorId string when user is present', () => {
        const result = toStandardTask({ ...baseIssue, user: { id: 201, login: 'octocat' } }, 'octocat', 'hello-world');
        expect(result.creatorId).toBe('201');
    });

    it('sets creatorId to null when no user', () => {
        const result = toStandardTask({ ...baseIssue, user: null }, 'octocat', 'hello-world');
        expect(result.creatorId).toBeNull();
    });

    it('maps label names to labels array', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.labels).toStrictEqual(['bug', 'urgent']);
    });

    it('sets dueDate to null', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.dueDate).toBeNull();
    });

    it('maps html_url to url', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.url).toBe('https://github.com/octocat/hello-world/issues/42');
    });

    it('sets projectId to owner/repo', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.projectId).toBe('octocat/hello-world');
    });

    it('includes number, owner, and repo in providerSpecific', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result.providerSpecific).toStrictEqual({
            number: 42,
            owner: 'octocat',
            repo: 'hello-world'
        });
    });

    it('returns a fully mapped StandardTask object for an open issue', () => {
        const result = toStandardTask(baseIssue, 'octocat', 'hello-world');
        expect(result).toStrictEqual({
            id: '1001',
            title: 'Fix the bug',
            description: 'This is the description',
            status: 'TODO',
            priority: 'NONE',
            assigneeId: '301',
            creatorId: '201',
            projectId: 'octocat/hello-world',
            labels: ['bug', 'urgent'],
            dueDate: null,
            url: 'https://github.com/octocat/hello-world/issues/42',
            providerSpecific: {
                number: 42,
                owner: 'octocat',
                repo: 'hello-world'
            },
            createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
            updatedAt: new Date('2024-01-16T12:00:00Z').toISOString()
        });
    });

    it('sets description to null when body is null', () => {
        const result = toStandardTask({ ...baseIssue, body: null }, 'octocat', 'hello-world');
        expect(result.description).toBeNull();
    });

    it('converts numeric id to string', () => {
        const result = toStandardTask({ ...baseIssue, id: 9999 }, 'octocat', 'hello-world');
        expect(result.id).toBe('9999');
    });
});
