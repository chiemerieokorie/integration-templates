import { z } from 'zod';
import { createAction } from 'nango';
import type { ProxyConfiguration } from 'nango';

const UpdateOrganizationInput = z.object({
    id: z.number().describe('Pipedrive organization ID. Example: 12345'),
    name: z.string().optional(),
    owner_id: z.number().optional(),
    address: z.string().optional(),
    visible_to: z.string().optional()
});

const UpdateOrganizationOutput = z.object({
    id: z.number(),
    name: z.string(),
    updated_at: z.string().nullable()
});

interface PipedriveOrgUpdateResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        update_time: string;
    };
}

const action = createAction({
    description: 'Update an organization (company) in Pipedrive',
    version: '1.0.0',

    endpoint: {
        method: 'PATCH',
        path: '/organizations',
        group: 'Organizations'
    },

    input: UpdateOrganizationInput,
    output: UpdateOrganizationOutput,
    scopes: ['contacts:full'],

    exec: async (nango, input): Promise<z.infer<typeof UpdateOrganizationOutput>> => {
        const data: Record<string, unknown> = {};

        if (input.name !== undefined) data['name'] = input.name;
        if (input.owner_id !== undefined) data['owner_id'] = input.owner_id;
        if (input.address !== undefined) data['address'] = input.address;
        if (input.visible_to !== undefined) data['visible_to'] = input.visible_to;

        const config: ProxyConfiguration = {
            // https://developers.pipedrive.com/docs/api/v1/Organizations#updateOrganization
            endpoint: `/v1/organizations/${input.id}`,
            data,
            retries: 3
        };

        const response = await nango.patch<PipedriveOrgUpdateResponse>(config);
        const org = response.data.data;

        return {
            id: org.id,
            name: org.name,
            updated_at: org.update_time ?? null
        };
    }
});

export type NangoActionLocal = Parameters<(typeof action)['exec']>[0];
export default action;
