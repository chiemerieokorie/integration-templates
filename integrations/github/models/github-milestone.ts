import { z } from 'zod';

export const GithubMilestone = z.object({
    id: z.number(),
    number: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    state: z.enum(['open', 'closed']),
    due_on: z.string().nullable(),
    closed_at: z.string().nullable(),
    open_issues: z.number(),
    closed_issues: z.number(),
    html_url: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export type GithubMilestone = z.infer<typeof GithubMilestone>;
