import { z } from 'zod';

export const CRMCompany = z.object({
    id: z.string(),
    name: z.string().nullable(),
    domain: z.string().nullable(),
    website: z.string().nullable(),
    industry: z.string().nullable(),
    description: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    phone: z.string().nullable(),
    owner_id: z.string().nullable(),
    owner_name: z.string().nullable(),
    employee_count: z.number().nullable(),
    annual_revenue: z.number().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export type CRMCompany = z.infer<typeof CRMCompany>;

export const CreateCRMCompanyInput = z.object({
    name: z.string().optional(),
    domain: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    owner_id: z.string().optional(),
    employee_count: z.number().optional(),
    annual_revenue: z.number().optional()
});

export type CreateCRMCompanyInput = z.infer<typeof CreateCRMCompanyInput>;

export const UpdateCRMCompanyInput = CreateCRMCompanyInput.extend({
    id: z.string()
});

export type UpdateCRMCompanyInput = z.infer<typeof UpdateCRMCompanyInput>;
