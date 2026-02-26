import { z } from 'zod';

export const AtsJob = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    department: z.string().nullable(),
    location: z.string().nullable(),
    employmentType: z.string().nullable(),
    requisitionId: z.string().nullable(),
    isRemote: z.boolean().nullable(),
    url: z.string().nullable(),
    tags: z.array(z.string()),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    closedAt: z.string().nullable()
});

export type AtsJob = z.infer<typeof AtsJob>;
