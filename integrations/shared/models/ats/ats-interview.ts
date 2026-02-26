import { z } from 'zod';

export const AtsInterviewer = z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable()
});

export type AtsInterviewer = z.infer<typeof AtsInterviewer>;

export const AtsInterview = z.object({
    id: z.string(),
    candidateId: z.string().nullable(),
    jobId: z.string().nullable(),
    title: z.string().nullable(),
    scheduledAt: z.string().nullable(),
    durationMinutes: z.number().nullable(),
    location: z.string().nullable(),
    status: z.enum(['scheduled', 'completed', 'cancelled', 'unknown']),
    interviewers: AtsInterviewer.array(),
    providerSpecific: z.object({}).catchall(z.any())
});

export type AtsInterview = z.infer<typeof AtsInterview>;
