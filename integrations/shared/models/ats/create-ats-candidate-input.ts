import { z } from 'zod';

export const CreateAtsCandidateInput = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    location: z.string().optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    socialLinks: z
        .array(
            z.object({
                type: z.string(),
                url: z.string()
            })
        )
        .optional(),
    providerSpecific: z.object({}).catchall(z.any()).optional()
});

export type CreateAtsCandidateInput = z.infer<typeof CreateAtsCandidateInput>;
