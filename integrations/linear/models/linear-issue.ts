import { z } from 'zod';

export const LinearIssue = z.object({
    id: z.string(),
    assigneeId: z.union([z.string(), z.null()]),
    creatorId: z.union([z.string(), z.null()]),
    createdAt: z.string(),
    updatedAt: z.string(),
    description: z.union([z.string(), z.null()]),
    dueDate: z.union([z.string(), z.null()]),
    projectId: z.union([z.string(), z.null()]),
    teamId: z.string(),
    title: z.string(),
    status: z.string(),
    estimate: z.union([z.string(), z.null()])
});

export type LinearIssue = z.infer<typeof LinearIssue>;

export const CreateIssue = z.object({
    teamId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    projectId: z.string().optional(),
    milestoneId: z.string().optional(),
    assigneeId: z.string().optional(),
    priority: z.number().optional(),
    parentId: z.string().optional(),
    estimate: z.number().optional(),
    dueDate: z.string().optional()
});

export type CreateIssue = z.infer<typeof CreateIssue>;
