import { z } from 'zod';

export const Repo = z.object({
    id: z.number(),
    owner: z.string(),
    name: z.string(),
    full_name: z.string(),
    description: z.string(),
    url: z.string(),
    date_created: z.date(),
    date_last_modified: z.date()
});

export type Repo = z.infer<typeof Repo>;

export const WriteFileInput = z.object({
    owner: z.string(),
    repo: z.string(),
    path: z.string(),
    message: z.string(),
    content: z.string(),
    sha: z.string()
});

export type WriteFileInput = z.infer<typeof WriteFileInput>;

export const WriteFileOutput = z.object({
    url: z.string(),
    status: z.string(),
    sha: z.string()
});

export type WriteFileOutput = z.infer<typeof WriteFileOutput>;

export const GithubWriteFileActionResult = z.object({
    url: z.string(),
    status: z.string(),
    sha: z.string()
});

export type GithubWriteFileActionResult = z.infer<typeof GithubWriteFileActionResult>;
