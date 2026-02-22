import { z } from 'zod';

export const AsanaProject = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string(),
    id: z.string()
});

export type AsanaProject = z.infer<typeof AsanaProject>;
