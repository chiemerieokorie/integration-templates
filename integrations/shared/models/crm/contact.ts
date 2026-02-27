import { z } from 'zod';

export const CRMContact = z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    mobile_phone: z.string().nullable(),
    job_title: z.string().nullable(),
    department: z.string().nullable(),
    company_name: z.string().nullable(),
    company_id: z.string().nullable(),
    owner_id: z.string().nullable(),
    owner_name: z.string().nullable(),
    lead_status: z.string().nullable(),
    lifecycle_stage: z.string().nullable(),
    website: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export type CRMContact = z.infer<typeof CRMContact>;

export const CreateCRMContactInput = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    mobile_phone: z.string().optional(),
    job_title: z.string().optional(),
    department: z.string().optional(),
    company_name: z.string().optional(),
    company_id: z.string().optional(),
    owner_id: z.string().optional(),
    lead_status: z.string().optional(),
    lifecycle_stage: z.string().optional(),
    website: z.string().optional()
});

export type CreateCRMContactInput = z.infer<typeof CreateCRMContactInput>;

export const UpdateCRMContactInput = CreateCRMContactInput.extend({
    id: z.string()
});

export type UpdateCRMContactInput = z.infer<typeof UpdateCRMContactInput>;
