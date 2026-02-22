import { describe, it, expect } from 'vitest';
import { toStandardLabel } from '../mappers/to-standard-label.js';

const baseLabel = {
    id: 5001,
    name: 'bug',
    color: 'd73a4a',
    description: 'Something is not working',
    default: true
};

describe('toStandardLabel', () => {
    it('prepends # to the color value', () => {
        const result = toStandardLabel({ ...baseLabel, color: 'd73a4a' }, 'octocat', 'hello-world');
        expect(result.color).toBe('#d73a4a');
    });

    it('prepends # even for short hex colors', () => {
        const result = toStandardLabel({ ...baseLabel, color: '0075ca' }, 'octocat', 'hello-world');
        expect(result.color).toBe('#0075ca');
    });

    it('sets description to null when label description is null', () => {
        const result = toStandardLabel({ ...baseLabel, description: null }, 'octocat', 'hello-world');
        expect(result.description).toBeNull();
    });

    it('maps description when present', () => {
        const result = toStandardLabel(baseLabel, 'octocat', 'hello-world');
        expect(result.description).toBe('Something is not working');
    });

    it('sets teamId as owner/repo', () => {
        const result = toStandardLabel(baseLabel, 'octocat', 'hello-world');
        expect(result.teamId).toBe('octocat/hello-world');
    });

    it('converts numeric id to string', () => {
        const result = toStandardLabel({ ...baseLabel, id: 9876 }, 'octocat', 'hello-world');
        expect(result.id).toBe('9876');
    });

    it('includes default flag in providerSpecific', () => {
        const result = toStandardLabel({ ...baseLabel, default: true }, 'octocat', 'hello-world');
        expect(result.providerSpecific).toStrictEqual({ default: true });
    });

    it('sets createdAt and updatedAt to null', () => {
        const result = toStandardLabel(baseLabel, 'octocat', 'hello-world');
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('returns a fully mapped StandardLabel object', () => {
        const result = toStandardLabel(baseLabel, 'octocat', 'hello-world');
        expect(result).toStrictEqual({
            id: '5001',
            name: 'bug',
            color: '#d73a4a',
            description: 'Something is not working',
            teamId: 'octocat/hello-world',
            providerSpecific: {
                default: true
            },
            createdAt: null,
            updatedAt: null
        });
    });

    it('handles non-default label correctly', () => {
        const result = toStandardLabel({ ...baseLabel, default: false }, 'octocat', 'hello-world');
        expect(result.providerSpecific['default']).toBe(false);
    });

    it('maps label name correctly', () => {
        const result = toStandardLabel({ ...baseLabel, name: 'enhancement' }, 'octocat', 'hello-world');
        expect(result.name).toBe('enhancement');
    });
});
