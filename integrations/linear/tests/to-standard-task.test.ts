import { describe, it, expect } from 'vitest';
import { toStandardTask } from '../mappers/to-standard-task.js';
import type { LinearIssueResponse } from '../types.js';

type IssueInput = LinearIssueResponse & { priority?: number; labels?: { nodes: { name: string }[] } };

function makeIssue(overrides: Partial<IssueInput> = {}): IssueInput {
    return {
        id: 'issue-1',
        title: 'Test Issue',
        description: 'A test description',
        createdAt: '2024-03-01T10:00:00.000Z',
        updatedAt: '2024-03-02T10:00:00.000Z',
        dueDate: '2024-04-01T00:00:00.000Z',
        estimate: '3',
        assignee: {
            id: 'user-1',
            email: 'user@example.com',
            displayName: 'Alice Smith',
            avatarUrl: 'https://example.com/avatar.png',
            name: 'Alice Smith'
        },
        creator: {
            id: 'creator-1',
            email: 'creator@example.com',
            displayName: 'Bob Jones',
            avatarUrl: 'https://example.com/bob.png',
            name: 'Bob Jones'
        },
        project: { id: 'project-1' },
        team: { id: 'team-1' },
        state: {
            id: 'state-1',
            name: 'In Progress',
            description: 'Currently being worked on'
        },
        projectMilestone: { id: 'milestone-1' },
        priority: 2,
        labels: { nodes: [{ name: 'bug' }, { name: 'urgent' }] },
        ...overrides
    };
}

describe('toStandardTask', () => {
    it('maps a full issue to a StandardTask correctly', () => {
        const issue = makeIssue();
        const result = toStandardTask(issue);

        expect(result).toStrictEqual({
            id: 'issue-1',
            title: 'Test Issue',
            description: 'A test description',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            assigneeId: 'user-1',
            creatorId: 'creator-1',
            projectId: 'project-1',
            labels: ['bug', 'urgent'],
            dueDate: new Date('2024-04-01T00:00:00.000Z').toISOString(),
            url: 'https://linear.app/issue/issue-1',
            providerSpecific: {
                teamId: 'team-1',
                stateId: 'state-1',
                stateName: 'In Progress',
                estimate: '3',
                milestoneId: 'milestone-1'
            },
            createdAt: new Date('2024-03-01T10:00:00.000Z').toISOString(),
            updatedAt: new Date('2024-03-02T10:00:00.000Z').toISOString()
        });
    });

    it.each([
        ['Done', 'DONE'],
        ['Completed', 'DONE'],
        ['Finished', 'DONE'],
        ['Cancelled', 'CANCELLED'],
        ['Duplicate', 'CANCELLED'],
        ['In Progress', 'IN_PROGRESS'],
        ['Started', 'IN_PROGRESS'],
        ['In Review', 'IN_PROGRESS'],
        ['Testing', 'IN_PROGRESS'],
        ['Todo', 'TODO'],
        ['Backlog', 'TODO'],
        ['Unknown State', 'TODO']
    ])('maps status "%s" to %s', (stateName, expectedStatus) => {
        const issue = makeIssue({ state: { id: 'state-x', name: stateName, description: '' } });
        const result = toStandardTask(issue);
        expect(result.status).toBe(expectedStatus);
    });

    it.each([
        [1, 'URGENT'],
        [2, 'HIGH'],
        [3, 'MEDIUM'],
        [4, 'LOW'],
        [0, 'NONE'],
        [5, 'NONE'],
        [undefined, 'NONE']
    ])('maps priority %s to %s', (priority, expectedPriority) => {
        const issue = makeIssue({ priority });
        const result = toStandardTask(issue);
        expect(result.priority).toBe(expectedPriority);
    });

    it('maps null assignee to null assigneeId', () => {
        const issue = makeIssue({ assignee: null as any });
        const result = toStandardTask(issue);
        expect(result.assigneeId).toBeNull();
    });

    it('maps null creator to null creatorId', () => {
        const issue = makeIssue({ creator: null as any });
        const result = toStandardTask(issue);
        expect(result.creatorId).toBeNull();
    });

    it('maps missing labels to empty array', () => {
        const issue = makeIssue({ labels: undefined });
        const result = toStandardTask(issue);
        expect(result.labels).toStrictEqual([]);
    });

    it('maps empty labels nodes to empty array', () => {
        const issue = makeIssue({ labels: { nodes: [] } });
        const result = toStandardTask(issue);
        expect(result.labels).toStrictEqual([]);
    });

    it('formats dueDate to ISO string', () => {
        const issue = makeIssue({ dueDate: '2025-12-31' });
        const result = toStandardTask(issue);
        expect(result.dueDate).toBe(new Date('2025-12-31').toISOString());
    });

    it('maps null dueDate to null', () => {
        const issue = makeIssue({ dueDate: null as any });
        const result = toStandardTask(issue);
        expect(result.dueDate).toBeNull();
    });

    it('includes teamId, stateId, stateName, estimate, milestoneId in providerSpecific', () => {
        const issue = makeIssue();
        const result = toStandardTask(issue);
        expect(result.providerSpecific).toMatchObject({
            teamId: 'team-1',
            stateId: 'state-1',
            stateName: 'In Progress',
            estimate: '3',
            milestoneId: 'milestone-1'
        });
    });

    it('maps null projectMilestone to null milestoneId in providerSpecific', () => {
        const issue = makeIssue({ projectMilestone: null });
        const result = toStandardTask(issue);
        expect(result.providerSpecific.milestoneId).toBeNull();
    });

    it('maps null project to null projectId', () => {
        const issue = makeIssue({ project: null as any });
        const result = toStandardTask(issue);
        expect(result.projectId).toBeNull();
    });

    it('builds correct url from issue id', () => {
        const issue = makeIssue({ id: 'abc-123' });
        const result = toStandardTask(issue);
        expect(result.url).toBe('https://linear.app/issue/abc-123');
    });
});
