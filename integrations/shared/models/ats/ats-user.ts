import { z } from 'zod';

export const AtsUser = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    role: z.string().nullable(),
    isActive: z.boolean().nullable(),
    providerSpecific: z.object({}).catchall(z.any())
});

export type AtsUser = z.infer<typeof AtsUser>;
