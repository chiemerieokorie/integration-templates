import { z } from 'zod';

export const StandardCandidate = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    emails: z.array(
        z.object({
            value: z.string(),
            type: z.string().nullable(),
            isPrimary: z.boolean()
        })
    ),
    phoneNumbers: z.array(
        z.object({
            value: z.string(),
            type: z.string().nullable()
        })
    ),
    company: z.string().nullable(),
    title: z.string().nullable(),
    location: z.string().nullable(),
    applicationIds: z.array(z.string()),
    tags: z.array(z.string()),
    resumeUrl: z.string().nullable(),
    profileUrl: z.string().nullable(),
    source: z.string().nullable(),
    socialLinks: z.array(
        z.object({
            type: z.string(),
            url: z.string()
        })
    ),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardCandidate = z.infer<typeof StandardCandidate>;
