import { z } from 'zod';
import { BaseAsanaModel } from './asana-action-models.js';
import { AsanaUser } from './asana-user.js';

export const AsanaTask = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string(),
    created_at: z.union([z.string(), z.null()]),
    modified_at: z.union([z.string(), z.null()]),
    completed: z.boolean(),
    due_date: z.union([z.string(), z.null()]),
    tags: z.string().array(),
    start_on: z.union([z.string(), z.null()]),
    due_at: z.union([z.string(), z.null()]),
    due_on: z.union([z.string(), z.null()]),
    completed_at: z.union([z.string(), z.null()]),
    actual_time_minutes: z.number(),
    assignee: z.union([AsanaUser, z.null()]),
    start_at: z.union([z.string(), z.null()]),
    num_hearts: z.number(),
    num_likes: z.number(),
    workspace: BaseAsanaModel,
    hearted: z.boolean(),
    hearts: z.string().array(),
    liked: z.boolean(),
    likes: z.string().array(),
    notes: z.string(),
    assignee_status: z.string(),
    followers: BaseAsanaModel.array(),

    parent: z.object({
        gid: z.string(),
        resource_type: z.string(),
        name: z.string(),
        resource_subtype: z.string()
    }),

    permalink_url: z.string(),
    created_by: z.object({ gid: z.string() }).optional()
});

export type AsanaTask = z.infer<typeof AsanaTask>;
