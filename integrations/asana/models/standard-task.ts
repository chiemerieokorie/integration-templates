import { z } from 'zod';

export const StandardTask = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
    priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NONE']),
    assigneeId: z.string().nullable(),
    creatorId: z.string().nullable(),
    projectId: z.string().nullable(),
    labels: z.array(z.string()),
    dueDate: z.string().nullable(),
    url: z.string(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardTask = z.infer<typeof StandardTask>;
