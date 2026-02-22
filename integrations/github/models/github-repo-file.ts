import { z } from 'zod';

export const GithubRepoFile = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    last_modified_date: z.date()
});

export type GithubRepoFile = z.infer<typeof GithubRepoFile>;
