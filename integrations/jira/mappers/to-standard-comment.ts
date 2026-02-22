import type { Comment } from '../models/index.js';
import type { StandardComment } from '../models/index.js';

function extractTextFromAdf(node: any): string {
    if (!node) return '';
    if (node.type === 'text' && typeof node.text === 'string') return node.text;
    if (Array.isArray(node.content)) {
        return node.content.map(extractTextFromAdf).join('');
    }
    return '';
}

export function toStandardComment(comment: Comment, taskId: string): StandardComment {
    return {
        id: comment.id,
        body: extractTextFromAdf(comment.body),
        taskId,
        authorId: comment.author.accountId ?? null,
        parentId: null,
        providerSpecific: {
            rawBody: comment.body,
            authorDisplayName: comment.author.displayName
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    };
}
