import { z } from 'zod';

export const AtsApplication = z.object({
    id: z.string(),
    candidateId: z.string(),
    jobId: z.string().nullable(),
    jobTitle: z.string().nullable(),
    status: z.string(),
    stage: z.string().nullable(),
    stageId: z.string().nullable(),
    source: z.string().nullable(),
    appliedAt: z.string().nullable(),
    rejectedAt: z.string().nullable(),
    lastActivityAt: z.string().nullable(),
    rejectionReason: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type AtsApplication = z.infer<typeof AtsApplication>;
