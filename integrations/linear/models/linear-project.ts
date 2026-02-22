import { z } from 'zod';

export const LinearProject = z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    description: z.union([z.string(), z.null()]),
    createdAt: z.string(),
    updatedAt: z.string(),
    teamId: z.string()
});

export type LinearProject = z.infer<typeof LinearProject>;
