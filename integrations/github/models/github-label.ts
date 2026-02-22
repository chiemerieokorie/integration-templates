import { z } from 'zod';

export const GithubLabel = z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
    description: z.string().nullable(),
    default: z.boolean()
});

export type GithubLabel = z.infer<typeof GithubLabel>;
