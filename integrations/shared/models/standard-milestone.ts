import { z } from 'zod';

export const StandardMilestone = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).nullable(),
    projectId: z.string().nullable(),
    startDate: z.string().nullable(),
    targetDate: z.string().nullable(),
    completedAt: z.string().nullable(),
    progress: z.number().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type StandardMilestone = z.infer<typeof StandardMilestone>;
