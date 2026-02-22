import { z } from 'zod';

export const Project = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    url: z.string(),
    projectTypeKey: z.string(),
    webUrl: z.string()
});

export type Project = z.infer<typeof Project>;
