import { z } from 'zod';

export const GithubIssue = z.object({
    id: z.string(),
    owner: z.string(),
    repo: z.string(),
    issue_number: z.number(),
    title: z.string(),
    author: z.string(),
    author_id: z.string(),
    state: z.string(),
    date_created: z.date(),
    date_last_modified: z.date(),
    body: z.string()
});

export type GithubIssue = z.infer<typeof GithubIssue>;

export const Issue = z.object({
    id: z.string(),
    owner: z.string(),
    repo: z.string(),
    issue_number: z.number(),
    title: z.string(),
    author: z.string(),
    author_id: z.string(),
    state: z.string(),
    date_created: z.date(),
    date_last_modified: z.date(),
    body: z.string()
});

export type Issue = z.infer<typeof Issue>;

export const GithubIssueRepoInput = z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string()
});

export type GithubIssueRepoInput = z.infer<typeof GithubIssueRepoInput>;
