import { z } from 'zod';

export const CreateAtsCandidateInput = z.object({
    firstName: z.string().describe('Candidate first name. Example: "Jane"'),
    lastName: z.string().describe('Candidate last name. Example: "Smith"'),
    email: z.string().optional().describe('Primary email address. Example: "jane@example.com"'),
    phone: z.string().optional().describe('Phone number. Example: "+1-555-123-4567"'),
    company: z.string().optional().describe('Current company name. Example: "Acme Inc"'),
    title: z.string().optional().describe('Job title or headline. Example: "Senior Engineer"'),
    location: z.string().optional().describe('Location or city. Example: "San Francisco, CA"'),
    source: z.string().optional().describe('Recruiting source. Example: "LinkedIn"'),
    tags: z.array(z.string()).optional().describe('Tags for categorization. Example: ["engineering", "senior"]'),
    socialLinks: z
        .array(
            z.object({
                type: z.string().describe('Link type. Example: "linkedin", "github", "website"'),
                url: z.string().describe('Full URL. Example: "https://linkedin.com/in/janesmith"')
            })
        )
        .optional()
        .describe('Social profile links'),
    providerSpecific: z
        .object({})
        .catchall(z.any())
        .optional()
        .describe('Provider-specific required fields. Gem: created_by, Lever: perform_as, Workable: shortcode')
});

export type CreateAtsCandidateInput = z.infer<typeof CreateAtsCandidateInput>;
