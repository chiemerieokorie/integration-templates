import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreatePersonInput = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    company_id: z.string().optional().describe('Twenty CRM company ID to associate. Example: "a1b2c3d4-e5f6-..."'),
    job_title: z.string().optional()
});

const CreatePersonOutput = z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    created_at: z.string().nullable()
});


const action = createAction({
    description: 'Create a new person (contact) in Twenty CRM',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/people',
        group: 'People'
    },

    input: CreatePersonInput,
    output: CreatePersonOutput,
    scopes: [],

    exec: async (nango, input): Promise<z.infer<typeof CreatePersonOutput>> => {
        const personData: Record<string, unknown> = {
            name: { firstName: input.first_name, lastName: input.last_name }
        };

        if (input.email) personData['emails'] = { primaryEmail: input.email };
        if (input.phone) personData['phones'] = { primaryPhoneNumber: input.phone };
        if (input.city) personData['city'] = input.city;
        if (input.company_id) personData['companyId'] = input.company_id;
        if (input.job_title) personData['jobTitle'] = input.job_title;

        const config: ProxyConfiguration = {
            // https://docs.twenty.com/developers/extend/capabilities/apis
            endpoint: '/rest/people',
            data: personData,
            retries: 3
        };

        const response = await nango.post<{ id: string; name: { firstName: string | null; lastName: string | null }; emails: { primaryEmail: string | null }; phones: { primaryPhoneNumber: string | null }; createdAt: string | null }>(config);
        const person = response.data;

        return {
            id: person.id,
            first_name: person.name?.firstName ?? null,
            last_name: person.name?.lastName ?? null,
            email: person.emails?.primaryEmail ?? null,
            phone: person.phones?.primaryPhoneNumber ?? null,
            created_at: person.createdAt ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
