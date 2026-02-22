import { z } from 'zod';

export const StandardComment = z.object({
    id: z.string(),
    body: z.string(),
    taskId: z.string(),
    authorId: z.string().nullable(),
    parentId: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type StandardComment = z.infer<typeof StandardComment>;
