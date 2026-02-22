import { z } from 'zod';

export const LinearLabel = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    team: z.object({ id: z.string() }).optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type LinearLabel = z.infer<typeof LinearLabel>;
