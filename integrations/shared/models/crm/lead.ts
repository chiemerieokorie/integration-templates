import { z } from 'zod';

export const CRMLead = z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    company_name: z.string().nullable(),
    title: z.string().nullable(),
    website: z.string().nullable(),
    industry: z.string().nullable(),
    owner_id: z.string().nullable(),
    owner_name: z.string().nullable(),
    lead_source: z.string().nullable(),
    lead_status: z.string().nullable(),
    converted: z.boolean().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export type CRMLead = z.infer<typeof CRMLead>;

export const CreateCRMLeadInput = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company_name: z.string().optional(),
    title: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().optional(),
    owner_id: z.string().optional(),
    lead_source: z.string().optional(),
    lead_status: z.string().optional()
});

export type CreateCRMLeadInput = z.infer<typeof CreateCRMLeadInput>;

export const UpdateCRMLeadInput = CreateCRMLeadInput.extend({
    id: z.string()
});

export type UpdateCRMLeadInput = z.infer<typeof UpdateCRMLeadInput>;
