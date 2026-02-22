import { z } from 'zod';

export const StandardTeam = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    url: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardTeam = z.infer<typeof StandardTeam>;
