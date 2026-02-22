import { z } from 'zod';

export const StandardUser = z.object({
    id: z.string(),
    displayName: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    isActive: z.boolean().nullable(),
    providerSpecific: z.object({}).catchall(z.any()),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type StandardUser = z.infer<typeof StandardUser>;
