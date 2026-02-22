import { describe, it, expect } from 'vitest';
import { toStandardComment } from '../mappers/to-standard-comment.js';
import type { Comment } from '../models/index.js';

function makeComment(overrides: Partial<Comment> = {}): Comment {
    return {
        id: 'comment-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T11:00:00.000Z',
        author: {
            accountId: 'user-abc',
            active: true,
            displayName: 'Jane Doe',
            emailAddress: 'jane@example.com'
        },
        body: {},
        ...overrides
    };
}

describe('toStandardComment', () => {
    it('extracts plain text from a simple ADF text node', () => {
        const comment = makeComment({
            body: {
                version: 1,
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'Hello world' }
                        ]
                    }
                ]
            }
        });
        const result = toStandardComment(comment, 'task-1');
        expect(result.body).toBe('Hello world');
    });

    it('recursively extracts text from nested ADF content', () => {
        const comment = makeComment({
            body: {
                version: 1,
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'First ' },
                            { type: 'text', text: 'Second' }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: ' Third' }
                        ]
                    }
                ]
            }
        });
        const result = toStandardComment(comment, 'task-1');
        expect(result.body).toBe('First Second Third');
    });

    it('returns empty string for empty body object', () => {
        const comment = makeComment({ body: {} });
        const result = toStandardComment(comment, 'task-1');
        expect(result.body).toBe('');
    });

    it('sets authorId to null when author.accountId is null', () => {
        const comment = makeComment({
            author: { accountId: null, active: true, displayName: 'Bot', emailAddress: null }
        });
        const result = toStandardComment(comment, 'task-1');
        expect(result.authorId).toBeNull();
    });

    it('maps author.accountId to authorId when present', () => {
        const comment = makeComment();
        const result = toStandardComment(comment, 'task-1');
        expect(result.authorId).toBe('user-abc');
    });

    it('passes taskId through correctly', () => {
        const result = toStandardComment(makeComment(), 'task-xyz-789');
        expect(result.taskId).toBe('task-xyz-789');
    });

    it('always sets parentId to null', () => {
        const result = toStandardComment(makeComment(), 'task-1');
        expect(result.parentId).toBeNull();
    });

    it('puts rawBody and authorDisplayName in providerSpecific', () => {
        const body = { version: 1, type: 'doc', content: [] };
        const comment = makeComment({ body });
        const result = toStandardComment(comment, 'task-1');
        expect(result.providerSpecific).toStrictEqual({
            rawBody: body,
            authorDisplayName: 'Jane Doe'
        });
    });

    it('preserves createdAt and updatedAt from comment', () => {
        const result = toStandardComment(makeComment(), 'task-1');
        expect(result.createdAt).toBe('2024-01-15T10:00:00.000Z');
        expect(result.updatedAt).toBe('2024-01-15T11:00:00.000Z');
    });

    it('maps comment id correctly', () => {
        const comment = makeComment({ id: 'cmt-999' });
        const result = toStandardComment(comment, 'task-1');
        expect(result.id).toBe('cmt-999');
    });
});
