import { describe, it, expect } from 'vitest';
import { toStandardTeam } from '../mappers/to-standard-team.js';
import type { AsanaWorkspace } from '../models/index.js';

function makeWorkspace(overrides: Partial<AsanaWorkspace> = {}): AsanaWorkspace {
    return {
        gid: 'ws-gid-1',
        resource_type: 'workspace',
        name: 'My Workspace',
        id: 'ws-id-1',
        is_organization: false,
        ...overrides
    };
}

describe('toStandardTeam', () => {
    it('maps gid to id', () => {
        const workspace = makeWorkspace({ gid: 'ws-gid-99' });
        const result = toStandardTeam(workspace);
        expect(result.id).toBe('ws-gid-99');
    });

    it('maps name correctly', () => {
        const workspace = makeWorkspace({ name: 'Acme Corp' });
        const result = toStandardTeam(workspace);
        expect(result.name).toBe('Acme Corp');
    });

    it('sets is_organization: true in providerSpecific when workspace is an organization', () => {
        const workspace = makeWorkspace({ is_organization: true });
        const result = toStandardTeam(workspace);
        expect(result.providerSpecific).toStrictEqual({ isOrganization: true });
    });

    it('sets is_organization: false in providerSpecific when workspace is not an organization', () => {
        const workspace = makeWorkspace({ is_organization: false });
        const result = toStandardTeam(workspace);
        expect(result.providerSpecific).toStrictEqual({ isOrganization: false });
    });

    it('sets description, url, createdAt, updatedAt all to null', () => {
        const workspace = makeWorkspace();
        const result = toStandardTeam(workspace);
        expect(result.description).toBeNull();
        expect(result.url).toBeNull();
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('maps the full workspace correctly', () => {
        const workspace = makeWorkspace({
            gid: 'gid-full-ws',
            name: 'Full Workspace',
            resource_type: 'workspace',
            id: 'id-full-ws',
            is_organization: true
        });
        const result = toStandardTeam(workspace);
        expect(result).toStrictEqual({
            id: 'gid-full-ws',
            name: 'Full Workspace',
            description: null,
            url: null,
            providerSpecific: { isOrganization: true },
            createdAt: null,
            updatedAt: null
        });
    });

    it('maps a non-organization workspace correctly', () => {
        const workspace = makeWorkspace({
            gid: 'gid-personal',
            name: 'Personal Projects',
            resource_type: 'workspace',
            id: 'id-personal',
            is_organization: false
        });
        const result = toStandardTeam(workspace);
        expect(result).toStrictEqual({
            id: 'gid-personal',
            name: 'Personal Projects',
            description: null,
            url: null,
            providerSpecific: { isOrganization: false },
            createdAt: null,
            updatedAt: null
        });
    });
});
