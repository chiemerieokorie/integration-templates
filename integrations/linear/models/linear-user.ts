import { z } from 'zod';

export const LinearUser = z.object({
    id: z.string(),
    admin: z.boolean(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string().optional(),
    avatarUrl: z.union([z.string(), z.null()])
});

export type LinearUser = z.infer<typeof LinearUser>;
