import { z } from 'zod';

export const LinearTeamBase = z.object({
    id: z.string(),
    name: z.string()
});

export type LinearTeamBase = z.infer<typeof LinearTeamBase>;

export const LinearTeam = z.object({
    id: z.string(),
    name: z.string(),
    description: z.union([z.string(), z.null()]),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type LinearTeam = z.infer<typeof LinearTeam>;

export const TeamsPaginatedResponse = z.object({
    teams: LinearTeamBase.array(),

    pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.union([z.string(), z.null()])
    })
});

export type TeamsPaginatedResponse = z.infer<typeof TeamsPaginatedResponse>;

export const FetchTeamsInput = z.object({
    after: z.string().optional(),
    pageSize: z.number().optional()
});

export type FetchTeamsInput = z.infer<typeof FetchTeamsInput>;
