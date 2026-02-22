import { z } from 'zod';

export const StandardLabel = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().nullable(),
    description: z.string().nullable(),
    teamId: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardLabel = z.infer<typeof StandardLabel>;
