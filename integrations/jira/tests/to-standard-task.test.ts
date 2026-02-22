import { describe, it, expect } from 'vitest';
import { toStandardTask } from '../mappers/to-standard-task.js';
import type { JiraIssueResponse } from '../types.js';

function makeIssue(overrides: Partial<JiraIssueResponse['fields']> & { id?: string; key?: string } = {}): JiraIssueResponse {
    const { id = 'issue-1', key = 'PROJ-1', ...fieldOverrides } = overrides;
    return {
        expand: '',
        id,
        self: 'https://example.atlassian.net/rest/api/3/issue/issue-1',
        key,
        fields: {
            summary: 'Test issue',
            issuetype: {
                self: '',
                id: '10001',
                description: '',
                iconUrl: '',
                name: 'Story',
                subtask: false,
                avatarId: 0,
                entityId: 'eid-1',
                hierarchyLevel: 0
            },
            created: '2024-01-15T10:00:00.000+0000',
            project: {
                self: '',
                id: 'proj-1',
                key: 'PROJ',
                name: 'My Project',
                projectTypeKey: 'software',
                simplified: false,
                avatarUrls: { '48x48': '', '24x24': '', '16x16': '', '32x32': '' }
            },
            description: null,
            reporter: {
                self: '',
                accountId: 'reporter-123',
                displayName: 'Jane Reporter',
                active: true,
                timeZone: 'UTC',
                accountType: 'atlassian',
                avatarUrls: { '48x48': '', '24x24': '', '16x16': '', '32x32': '' }
            },
            comment: {
                comments: [],
                self: '',
                maxResults: 0,
                total: 0,
                startAt: 0
            },
            assignee: null,
            updated: '2024-01-16T12:00:00.000+0000',
            status: {
                self: '',
                description: '',
                iconUrl: '',
                name: 'To Do',
                id: '1',
                statusCategory: {
                    self: '',
                    id: 1,
                    key: 'new',
                    colorName: 'blue-gray',
                    name: 'To Do'
                }
            },
            priority: null,
            labels: [],
            duedate: null,
            ...fieldOverrides
        }
    };
}

describe('toStandardTask', () => {
    it('maps status category "done" to DONE', () => {
        const issue = makeIssue({
            status: {
                self: '',
                description: '',
                iconUrl: '',
                name: 'Done',
                id: '3',
                statusCategory: { self: '', id: 3, key: 'done', colorName: 'green', name: 'Done' }
            }
        });
        const result = toStandardTask(issue, 'https://example.atlassian.net');
        expect(result.status).toBe('DONE');
    });

    it('maps status category "indeterminate" to IN_PROGRESS', () => {
        const issue = makeIssue({
            status: {
                self: '',
                description: '',
                iconUrl: '',
                name: 'In Progress',
                id: '2',
                statusCategory: { self: '', id: 4, key: 'indeterminate', colorName: 'yellow', name: 'In Progress' }
            }
        });
        const result = toStandardTask(issue, 'https://example.atlassian.net');
        expect(result.status).toBe('IN_PROGRESS');
    });

    it('maps status category "new" (default) to TODO', () => {
        const issue = makeIssue();
        const result = toStandardTask(issue, 'https://example.atlassian.net');
        expect(result.status).toBe('TODO');
    });

    it('maps priority "Highest" and "Critical" to URGENT', () => {
        const issueHighest = makeIssue({ priority: { name: 'Highest', id: '1' } });
        const issueCritical = makeIssue({ priority: { name: 'Critical', id: '2' } });
        expect(toStandardTask(issueHighest, 'https://x.atlassian.net').priority).toBe('URGENT');
        expect(toStandardTask(issueCritical, 'https://x.atlassian.net').priority).toBe('URGENT');
    });

    it('maps priority "High" to HIGH, "Medium" to MEDIUM', () => {
        const issueHigh = makeIssue({ priority: { name: 'High', id: '2' } });
        const issueMedium = makeIssue({ priority: { name: 'Medium', id: '3' } });
        expect(toStandardTask(issueHigh, 'https://x.atlassian.net').priority).toBe('HIGH');
        expect(toStandardTask(issueMedium, 'https://x.atlassian.net').priority).toBe('MEDIUM');
    });

    it('maps priority "Low", "Lowest", "Minor" to LOW', () => {
        const low = makeIssue({ priority: { name: 'Low', id: '4' } });
        const lowest = makeIssue({ priority: { name: 'Lowest', id: '5' } });
        const minor = makeIssue({ priority: { name: 'Minor', id: '6' } });
        expect(toStandardTask(low, 'https://x.atlassian.net').priority).toBe('LOW');
        expect(toStandardTask(lowest, 'https://x.atlassian.net').priority).toBe('LOW');
        expect(toStandardTask(minor, 'https://x.atlassian.net').priority).toBe('LOW');
    });

    it('maps null priority to NONE', () => {
        const issue = makeIssue({ priority: null });
        expect(toStandardTask(issue, 'https://x.atlassian.net').priority).toBe('NONE');
    });

    it('maps assignee accountId when assignee is present', () => {
        const issue = makeIssue({
            assignee: {
                self: '',
                accountId: 'assignee-abc',
                displayName: 'Assignee Name',
                active: true,
                timeZone: 'UTC',
                accountType: 'atlassian',
                avatarUrls: { '48x48': '', '24x24': '', '16x16': '', '32x32': '' }
            }
        });
        expect(toStandardTask(issue, 'https://x.atlassian.net').assigneeId).toBe('assignee-abc');
    });

    it('sets assigneeId to null when no assignee', () => {
        const issue = makeIssue({ assignee: null });
        expect(toStandardTask(issue, 'https://x.atlassian.net').assigneeId).toBeNull();
    });

    it('maps reporter accountId to creatorId', () => {
        const issue = makeIssue();
        expect(toStandardTask(issue, 'https://x.atlassian.net').creatorId).toBe('reporter-123');
    });

    it('maps labels array', () => {
        const issue = makeIssue({ labels: ['bug', 'frontend', 'urgent'] });
        expect(toStandardTask(issue, 'https://x.atlassian.net').labels).toStrictEqual(['bug', 'frontend', 'urgent']);
    });

    it('formats duedate as ISO string', () => {
        const issue = makeIssue({ duedate: '2024-03-15' });
        const result = toStandardTask(issue, 'https://x.atlassian.net');
        expect(result.dueDate).toBe(new Date('2024-03-15').toISOString());
    });

    it('sets dueDate to null when no duedate', () => {
        const issue = makeIssue({ duedate: null });
        expect(toStandardTask(issue, 'https://x.atlassian.net').dueDate).toBeNull();
    });

    it('constructs url from baseUrl and issue key', () => {
        const issue = makeIssue({ id: 'i-99', key: 'PROJ-42' });
        issue.key = 'PROJ-42';
        const result = toStandardTask(issue, 'https://myorg.atlassian.net');
        expect(result.url).toBe('https://myorg.atlassian.net/browse/PROJ-42');
    });

    it('puts key, issueType, projectKey, projectName in providerSpecific', () => {
        const issue = makeIssue();
        issue.key = 'PROJ-1';
        const result = toStandardTask(issue, 'https://x.atlassian.net');
        expect(result.providerSpecific).toStrictEqual({
            key: 'PROJ-1',
            issueType: 'Story',
            projectKey: 'PROJ',
            projectName: 'My Project'
        });
    });
});
