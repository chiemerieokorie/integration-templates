import { describe, it, expect } from 'vitest';
import { toStandardTask } from '../mappers/to-standard-task.js';
import type { AsanaTask } from '../models/index.js';

function makeTask(overrides: Partial<AsanaTask> = {}): AsanaTask {
    return {
        gid: 'task-gid-1',
        resource_type: 'task',
        name: 'Test Task',
        created_at: '2024-01-01T00:00:00.000Z',
        modified_at: '2024-01-02T00:00:00.000Z',
        completed: false,
        due_date: null,
        tags: [],
        start_on: null,
        due_at: null,
        due_on: null,
        completed_at: null,
        actual_time_minutes: 0,
        assignee: null,
        start_at: null,
        num_hearts: 0,
        num_likes: 0,
        workspace: { gid: 'ws-gid-1', resource_type: 'workspace', name: 'My Workspace' },
        hearted: false,
        hearts: [],
        liked: false,
        likes: [],
        notes: '',
        assignee_status: 'upcoming',
        followers: [],
        parent: { gid: 'parent-gid-1', resource_type: 'task', name: 'Parent Task', resource_subtype: 'default_task' },
        permalink_url: 'https://app.asana.com/0/1/task-gid-1',
        ...overrides
    };
}

describe('toStandardTask', () => {
    it('maps a completed task to status DONE', () => {
        const task = makeTask({ completed: true, completed_at: '2024-01-03T00:00:00.000Z' });
        const result = toStandardTask(task, null);
        expect(result.status).toBe('DONE');
    });

    it('maps an incomplete task to status TODO', () => {
        const task = makeTask({ completed: false });
        const result = toStandardTask(task, null);
        expect(result.status).toBe('TODO');
    });

    it('maps assignee gid to assigneeId when assignee is present', () => {
        const task = makeTask({
            assignee: {
                gid: 'user-gid-42',
                resource_type: 'user',
                name: 'Alice',
                id: 'user-id-42',
                email: 'alice@example.com',
                photo: null,
                workspace: 'ws-gid-1'
            }
        });
        const result = toStandardTask(task, null);
        expect(result.assigneeId).toBe('user-gid-42');
    });

    it('sets assigneeId to null when assignee is absent', () => {
        const task = makeTask({ assignee: null });
        const result = toStandardTask(task, null);
        expect(result.assigneeId).toBeNull();
    });

    it('maps created_by gid to creatorId when present', () => {
        const task = makeTask({ created_by: { gid: 'creator-gid-7' } });
        const result = toStandardTask(task, null);
        expect(result.creatorId).toBe('creator-gid-7');
    });

    it('sets creatorId to null when created_by is absent', () => {
        const task = makeTask({ created_by: undefined });
        const result = toStandardTask(task, null);
        expect(result.creatorId).toBeNull();
    });

    it('maps tags array to labels', () => {
        const task = makeTask({ tags: ['tag-1', 'tag-2', 'tag-3'] });
        const result = toStandardTask(task, 'proj-gid-1');
        expect(result.labels).toStrictEqual(['tag-1', 'tag-2', 'tag-3']);
    });

    it('sets labels to empty array when tags is empty', () => {
        const task = makeTask({ tags: [] });
        const result = toStandardTask(task, null);
        expect(result.labels).toStrictEqual([]);
    });

    it('converts due_on to ISO string for dueDate', () => {
        const task = makeTask({ due_on: '2024-03-15' });
        const result = toStandardTask(task, null);
        expect(result.dueDate).toBe(new Date('2024-03-15').toISOString());
    });

    it('sets dueDate to null when due_on is null', () => {
        const task = makeTask({ due_on: null });
        const result = toStandardTask(task, null);
        expect(result.dueDate).toBeNull();
    });

    it('passes projectId through', () => {
        const task = makeTask();
        const result = toStandardTask(task, 'proj-gid-99');
        expect(result.projectId).toBe('proj-gid-99');
    });

    it('sets projectId to null when null is passed', () => {
        const task = makeTask();
        const result = toStandardTask(task, null);
        expect(result.projectId).toBeNull();
    });

    it('populates providerSpecific with resourceType, assigneeStatus, and workspaceId', () => {
        const task = makeTask({ assignee_status: 'inbox', resource_type: 'task' });
        const result = toStandardTask(task, null);
        expect(result.providerSpecific).toMatchObject({
            resourceType: 'task',
            assigneeStatus: 'inbox',
            workspaceId: 'ws-gid-1'
        });
    });

    it('maps the full task correctly', () => {
        const task = makeTask({
            gid: 'gid-full',
            name: 'Full Task',
            notes: 'Some notes',
            completed: false,
            created_at: '2024-01-01T00:00:00.000Z',
            modified_at: '2024-01-05T00:00:00.000Z',
            permalink_url: 'https://app.asana.com/0/1/gid-full'
        });
        const result = toStandardTask(task, 'proj-abc');
        expect(result).toStrictEqual({
            id: 'gid-full',
            title: 'Full Task',
            description: 'Some notes',
            status: 'TODO',
            priority: 'NONE',
            assigneeId: null,
            creatorId: null,
            projectId: 'proj-abc',
            labels: [],
            dueDate: null,
            url: 'https://app.asana.com/0/1/gid-full',
            providerSpecific: {
                resourceType: 'task',
                assigneeStatus: 'upcoming',
                completedAt: null,
                startOn: null,
                numLikes: 0,
                workspaceId: 'ws-gid-1'
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-05T00:00:00.000Z'
        });
    });
});
