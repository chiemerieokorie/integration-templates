import { z } from 'zod';

export const StandardProject = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(['PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).nullable(),
    startDate: z.string().nullable(),
    targetDate: z.string().nullable(),
    ownerId: z.string().nullable(),
    teamId: z.string().nullable(),
    url: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardProject = z.infer<typeof StandardProject>;
