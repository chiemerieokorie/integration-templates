import { z } from 'zod';

export const LinearCycle = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    number: z.number(),
    startsAt: z.string(),
    endsAt: z.string(),
    completedAt: z.string().nullable(),
    progress: z.number(),
    team: z.object({ id: z.string() }),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type LinearCycle = z.infer<typeof LinearCycle>;
