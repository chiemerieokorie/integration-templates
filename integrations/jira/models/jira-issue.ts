import { z } from 'zod';

export const Timestamps = z.object({
    createdAt: z.string(),
    updatedAt: z.string()
});

export type Timestamps = z.infer<typeof Timestamps>;

export const Author = z.object({
    accountId: z.union([z.string(), z.null()]),
    active: z.boolean(),
    displayName: z.string(),
    emailAddress: z.union([z.string(), z.null()])
});

export type Author = z.infer<typeof Author>;

export const Comment = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: Author,
    body: z.object({}).catchall(z.any())
});

export type Comment = z.infer<typeof Comment>;

export const Issue = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    key: z.string(),
    summary: z.string(),
    issueType: z.string(),
    status: z.string(),
    assignee: z.union([z.string(), z.null()]),
    url: z.string(),
    webUrl: z.string(),
    projectId: z.string(),
    projectKey: z.string(),
    projectName: z.string(),
    comments: z.array(Comment)
});

export type Issue = z.infer<typeof Issue>;
