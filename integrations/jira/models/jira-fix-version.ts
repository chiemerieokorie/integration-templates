import { z } from 'zod';

export const JiraFixVersion = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    archived: z.boolean(),
    released: z.boolean(),
    startDate: z.string().optional(), // ISO date
    releaseDate: z.string().optional(), // ISO date
    projectId: z.string()
});

export type JiraFixVersion = z.infer<typeof JiraFixVersion>;
