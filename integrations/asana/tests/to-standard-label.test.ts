import { describe, it, expect } from 'vitest';
import { toStandardLabel } from '../mappers/to-standard-label.js';
import type { AsanaTag } from '../models/index.js';

function makeTag(overrides: Partial<AsanaTag> = {}): AsanaTag {
    return {
        gid: 'tag-gid-1',
        resource_type: 'tag',
        name: 'Backend',
        color: 'dark-blue',
        workspace: { gid: 'ws-gid-1' },
        created_at: '2024-01-01T00:00:00.000Z',
        ...overrides
    };
}

describe('toStandardLabel', () => {
    it('maps gid to id', () => {
        const tag = makeTag({ gid: 'tag-gid-99' });
        const result = toStandardLabel(tag);
        expect(result.id).toBe('tag-gid-99');
    });

    it('maps name correctly', () => {
        const tag = makeTag({ name: 'Frontend' });
        const result = toStandardLabel(tag);
        expect(result.name).toBe('Frontend');
    });

    it('always sets color to null (Asana uses named colors, not hex)', () => {
        const tag = makeTag({ color: 'dark-red' });
        const result = toStandardLabel(tag);
        expect(result.color).toBeNull();
    });

    it('sets color to null even when Asana color is null', () => {
        const tag = makeTag({ color: null });
        const result = toStandardLabel(tag);
        expect(result.color).toBeNull();
    });

    it('puts Asana color name in providerSpecific.colorName', () => {
        const tag = makeTag({ color: 'dark-green' });
        const result = toStandardLabel(tag);
        expect(result.providerSpecific).toStrictEqual({ colorName: 'dark-green' });
    });

    it('puts null color in providerSpecific.colorName when color is null', () => {
        const tag = makeTag({ color: null });
        const result = toStandardLabel(tag);
        expect(result.providerSpecific).toStrictEqual({ colorName: null });
    });

    it('maps workspace.gid to teamId', () => {
        const tag = makeTag({ workspace: { gid: 'ws-gid-99' } });
        const result = toStandardLabel(tag);
        expect(result.teamId).toBe('ws-gid-99');
    });

    it('sets description to null', () => {
        const tag = makeTag();
        const result = toStandardLabel(tag);
        expect(result.description).toBeNull();
    });

    it('maps created_at to createdAt', () => {
        const tag = makeTag({ created_at: '2024-06-15T10:30:00.000Z' });
        const result = toStandardLabel(tag);
        expect(result.createdAt).toBe('2024-06-15T10:30:00.000Z');
    });

    it('sets createdAt to null when created_at is null', () => {
        const tag = makeTag({ created_at: null });
        const result = toStandardLabel(tag);
        expect(result.createdAt).toBeNull();
    });

    it('always sets updatedAt to null (not available from Asana API)', () => {
        const tag = makeTag();
        const result = toStandardLabel(tag);
        expect(result.updatedAt).toBeNull();
    });

    it('maps the full tag correctly', () => {
        const tag = makeTag({
            gid: 'gid-full-tag',
            name: 'Design',
            resource_type: 'tag',
            color: 'light-purple',
            workspace: { gid: 'ws-gid-main' },
            created_at: '2024-03-20T08:00:00.000Z'
        });
        const result = toStandardLabel(tag);
        expect(result).toStrictEqual({
            id: 'gid-full-tag',
            name: 'Design',
            color: null,
            description: null,
            teamId: 'ws-gid-main',
            providerSpecific: { colorName: 'light-purple' },
            createdAt: '2024-03-20T08:00:00.000Z',
            updatedAt: null
        });
    });
});
