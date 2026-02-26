import { z } from 'zod';

export const CreateAtsNoteInput = z.object({
    candidateId: z.string().describe('ID of the candidate. For Lever this is the opportunity ID. Example: "abc-123"'),
    body: z.string().describe('Note content in plain text or HTML'),
    visibility: z.enum(['public', 'private']).optional().describe('Note visibility. Maps to Lever secret, Workable policy. Example: "public"'),
    providerSpecific: z
        .object({})
        .catchall(z.any())
        .optional()
        .describe('Provider-specific required fields. Gem: user_id, Lever: perform_as, Workable: member_id')
});

export type CreateAtsNoteInput = z.infer<typeof CreateAtsNoteInput>;

export const AtsNote = z.object({
    id: z.string(),
    body: z.string(),
    createdAt: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any())
});

export type AtsNote = z.infer<typeof AtsNote>;
