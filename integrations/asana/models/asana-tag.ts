import { z } from 'zod';

export const AsanaTag = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string(),
    color: z.string().nullable(),
    workspace: z.object({ gid: z.string() }),
    created_at: z.string().nullable()
});

export type AsanaTag = z.infer<typeof AsanaTag>;
