import { z } from 'zod';

export const StandardCycle = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    number: z.number().nullable(),
    status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
    teamId: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    completedAt: z.string().nullable(),
    progress: z.number().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardCycle = z.infer<typeof StandardCycle>;
