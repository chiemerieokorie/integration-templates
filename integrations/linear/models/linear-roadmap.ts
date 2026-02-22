import { z } from 'zod';

export const LinearRoadmap = z.object({
    id: z.string(),
    name: z.string(),
    description: z.union([z.string(), z.null()]),
    createdAt: z.string(),
    updatedAt: z.string(),
    teamId: z.string(),
    projectIds: z.string()
});

export type LinearRoadmap = z.infer<typeof LinearRoadmap>;
