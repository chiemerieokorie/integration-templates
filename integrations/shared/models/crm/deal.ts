import { z } from 'zod';

export const CRMDeal = z.object({
    id: z.string(),
    name: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    close_date: z.string().nullable(),
    stage: z.string().nullable(),
    probability: z.number().nullable(),
    pipeline_id: z.string().nullable(),
    pipeline_name: z.string().nullable(),
    owner_id: z.string().nullable(),
    owner_name: z.string().nullable(),
    company_id: z.string().nullable(),
    company_name: z.string().nullable(),
    contact_ids: z.array(z.string()).nullable(),
    description: z.string().nullable(),
    status: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export type CRMDeal = z.infer<typeof CRMDeal>;

export const CreateCRMDealInput = z.object({
    name: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    close_date: z.string().optional(),
    stage: z.string().optional(),
    probability: z.number().optional(),
    pipeline_id: z.string().optional(),
    owner_id: z.string().optional(),
    company_id: z.string().optional(),
    contact_ids: z.array(z.string()).optional(),
    description: z.string().optional()
});

export type CreateCRMDealInput = z.infer<typeof CreateCRMDealInput>;

export const UpdateCRMDealInput = CreateCRMDealInput.extend({
    id: z.string()
});

export type UpdateCRMDealInput = z.infer<typeof UpdateCRMDealInput>;
