import { z } from 'zod';

export const CreateAtsNoteInput = z.object({
    candidateId: z.string(),
    body: z.string(),
    visibility: z.enum(['public', 'private']).optional(),
    providerSpecific: z.object({}).catchall(z.any()).optional()
});

export type CreateAtsNoteInput = z.infer<typeof CreateAtsNoteInput>;

export const AtsNote = z.object({
    id: z.string(),
    body: z.string(),
    createdAt: z.string().nullable(),
    providerSpecific: z.object({}).catchall(z.any())
});

export type AtsNote = z.infer<typeof AtsNote>;
