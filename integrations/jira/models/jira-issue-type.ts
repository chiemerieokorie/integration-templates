import { z } from 'zod';

export const JiraProjectId = z.object({
    id: z.string()
});

export type JiraProjectId = z.infer<typeof JiraProjectId>;

export const JiraIssueMetadata = z.object({
    projectIdsToSync: JiraProjectId.array(),
    cloudId: z.string().optional(),
    baseUrl: z.string().optional(),
    timeZone: z.string().optional()
});

export type JiraIssueMetadata = z.infer<typeof JiraIssueMetadata>;

export const IssueType = z.object({
    projectId: z.string(),
    id: z.string(),
    name: z.string(),
    description: z.union([z.string(), z.null()]),
    url: z.string()
});

export type IssueType = z.infer<typeof IssueType>;

export const CreateIssueInput = z.object({
    summary: z.string(),
    description: z.string().optional(),
    assignee: z.string().optional(),
    labels: z.string().array().optional(),
    project: z.string(),
    issueType: z.string()
});

export type CreateIssueInput = z.infer<typeof CreateIssueInput>;

export const CreateIssueOutput = z.object({
    id: z.string(),
    key: z.string(),
    self: z.string()
});

export type CreateIssueOutput = z.infer<typeof CreateIssueOutput>;
