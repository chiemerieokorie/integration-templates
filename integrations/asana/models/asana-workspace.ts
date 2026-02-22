import { z } from 'zod';

export const AsanaWorkspace = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string(),
    id: z.string(),
    is_organization: z.boolean()
});

export type AsanaWorkspace = z.infer<typeof AsanaWorkspace>;
