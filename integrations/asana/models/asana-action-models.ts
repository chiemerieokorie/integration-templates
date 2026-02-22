import { z } from 'zod';

export const Id = z.object({
    id: z.string()
});

export type Id = z.infer<typeof Id>;

export const Timestamps = z.object({
    created_at: z.union([z.string(), z.null()]),
    modified_at: z.union([z.string(), z.null()])
});

export type Timestamps = z.infer<typeof Timestamps>;

export const NangoActionError = z.object({
    type: z.union([z.literal('validation_error'), z.literal('generic_error')]),
    message: z.string()
});

export type NangoActionError = z.infer<typeof NangoActionError>;

export const BaseAsanaModel = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string()
});

export type BaseAsanaModel = z.infer<typeof BaseAsanaModel>;

export const Limit = z.object({
    limit: z.number()
});

export type Limit = z.infer<typeof Limit>;

export const User = z.object({
    created_at: z.union([z.string(), z.null()]),
    modified_at: z.union([z.string(), z.null()]),
    id: z.string(),
    name: z.string(),
    email: z.union([z.string(), z.null()]),
    avatar_url: z.union([z.string(), z.null()])
});

export type User = z.infer<typeof User>;

export const Task = z.object({
    created_at: z.union([z.string(), z.null()]),
    modified_at: z.union([z.string(), z.null()]),
    id: z.string(),
    title: z.string(),
    url: z.string(),
    status: z.string(),
    description: z.union([z.string(), z.null()]),
    assignee: z.union([User, z.null()]),
    due_date: z.union([z.string(), z.null()])
});

export type Task = z.infer<typeof Task>;

export const AsanaProjectInput = z.object({
    limit: z.number(),
    workspace: z.string()
});

export type AsanaProjectInput = z.infer<typeof AsanaProjectInput>;

export const CreateAsanaTask = z.object({
    name: z.string(),
    workspace: z.string(),
    parent: z.string(),
    projects: z.string().array()
});

export type CreateAsanaTask = z.infer<typeof CreateAsanaTask>;

export const AsanaUpdateTask = z.object({
    id: z.string(),
    due_at: z.string().optional(),
    due_on: z.string().optional(),
    completed: z.boolean(),
    notes: z.string(),
    projects: z.string().array(),
    assignee: z.string(),
    parent: z.string(),
    tags: z.string().array(),
    workspace: z.string(),
    name: z.string()
});

export type AsanaUpdateTask = z.infer<typeof AsanaUpdateTask>;

export const Anonymous_asana_action_fetchworkspaces_output = BaseAsanaModel.array();
export type Anonymous_asana_action_fetchworkspaces_output = z.infer<typeof Anonymous_asana_action_fetchworkspaces_output>;

export const Anonymous_asana_action_fetchprojects_output = BaseAsanaModel.array();
export type Anonymous_asana_action_fetchprojects_output = z.infer<typeof Anonymous_asana_action_fetchprojects_output>;

export const Anonymous_asana_action_deletetask_output = z.boolean();
export type Anonymous_asana_action_deletetask_output = z.infer<typeof Anonymous_asana_action_deletetask_output>;
