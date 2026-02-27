import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const CreateOrganizationInput = z.object({
    name: z.string(),
    owner_id: z.number().optional().describe('Pipedrive user ID to set as owner. Example: 12345'),
    address: z.string().optional(),
    visible_to: z.string().optional().describe('Visibility. Example: "3" (everyone)')
});

const CreateOrganizationOutput = z.object({
    id: z.number(),
    name: z.string(),
    owner_id: z.number().nullable(),
    address: z.string().nullable(),
    created_at: z.string().nullable()
});

interface PipedriveOrgResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        owner_id: { id: number } | null;
        address: string | null;
        add_time: string;
    };
}

const action = createAction({
    description: 'Create a new organization (company) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'POST',
        path: '/organizations',
        group: 'Organizations'
    },

    input: CreateOrganizationInput,
    output: CreateOrganizationOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof CreateOrganizationOutput>> => {
        const data: Record<string, unknown> = { name: input.name };

        if (input.owner_id) data['owner_id'] = input.owner_id;
        if (input.address) data['address'] = input.address;
        if (input.visible_to) data['visible_to'] = input.visible_to;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization
            endpoint: '/v1/organizations',
            data,
            retries: 3
        };

        const response = await nango.post<PipedriveOrgResponse>(config);
        const org = response.data.data;

        return {
            id: org.id,
            name: org.name,
            owner_id: org.owner_id?.id ?? null,
            address: org.address ?? null,
            created_at: org.add_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
