import { z } from 'zod';

export const LinearMilestone = z.object({
    id: z.string(),
    name: z.string(),
    progress: z.number(),
    description: z.union([z.string(), z.null()]),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.string(),

    project: z.object({
        id: z.string(),
        name: z.string()
    })
});

export type LinearMilestone = z.infer<typeof LinearMilestone>;
