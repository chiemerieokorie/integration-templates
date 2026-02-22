import type { Comment } from '../models/index.js';
import type { StandardComment } from '../models/index.js';
import { extractTextFromAdf } from '../helpers/extract-text-from-adf.js';

export function toStandardComment(comment: Comment, taskId: string): StandardComment {
    return {
        id: comment.id,
        body: extractTextFromAdf(comment.body) ?? '',
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
