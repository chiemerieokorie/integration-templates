import { z } from 'zod';

export const GithubUser = z.object({
    id: z.number(),
    login: z.string(),
    avatar_url: z.string(),
    type: z.enum(['User', 'Bot', 'Organization']),
    site_admin: z.boolean()
});

export type GithubUser = z.infer<typeof GithubUser>;
