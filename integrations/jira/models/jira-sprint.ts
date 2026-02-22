import { z } from 'zod';

export const JiraSprint = z.object({
    id: z.number(),
    name: z.string(),
    state: z.enum(['future', 'active', 'closed']),
    startDate: z.string().optional(),    // ISO datetime
    endDate: z.string().optional(),      // ISO datetime
    completeDate: z.string().optional(), // ISO datetime
    originBoardId: z.number(),
    goal: z.string().optional()
});

export type JiraSprint = z.infer<typeof JiraSprint>;
