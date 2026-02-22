import { describe, it, expect } from 'vitest';
import { toStandardLabel } from '../mappers/to-standard-label.js';
import type { LinearLabel } from '../models/index.js';

function makeLabel(overrides: Partial<LinearLabel> = {}): LinearLabel {
    return {
        id: 'label-1',
        name: 'Bug',
        color: '#ff0000',
        team: { id: 'team-1' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-06-01T00:00:00.000Z',
        ...overrides
    };
}

describe('toStandardLabel', () => {
    it('maps a full label to StandardLabel correctly', () => {
        const label = makeLabel();
        const result = toStandardLabel(label);

        expect(result).toStrictEqual({
            id: 'label-1',
            name: 'Bug',
            color: '#ff0000',
            description: null,
            teamId: 'team-1',
            providerSpecific: {},
            createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
            updatedAt: new Date('2024-06-01T00:00:00.000Z').toISOString()
        });
    });

    it('maps undefined team to null teamId', () => {
        const label = makeLabel({ team: undefined });
        const result = toStandardLabel(label);
        expect(result.teamId).toBeNull();
    });

    it('preserves the color value', () => {
        const label = makeLabel({ color: '#00ff00' });
        const result = toStandardLabel(label);
        expect(result.color).toBe('#00ff00');
    });

    it('always sets description to null', () => {
        const label = makeLabel();
        const result = toStandardLabel(label);
        expect(result.description).toBeNull();
    });

    it('sets providerSpecific to empty object', () => {
        const label = makeLabel();
        const result = toStandardLabel(label);
        expect(result.providerSpecific).toStrictEqual({});
    });

    it('converts createdAt and updatedAt to ISO strings', () => {
        const label = makeLabel({
            createdAt: '2023-07-15T08:30:00.000Z',
            updatedAt: '2024-11-20T12:00:00.000Z'
        });
        const result = toStandardLabel(label);
        expect(result.createdAt).toBe(new Date('2023-07-15T08:30:00.000Z').toISOString());
        expect(result.updatedAt).toBe(new Date('2024-11-20T12:00:00.000Z').toISOString());
    });

    it('preserves label name', () => {
        const label = makeLabel({ name: 'Feature Request' });
        const result = toStandardLabel(label);
        expect(result.name).toBe('Feature Request');
    });

    it('preserves label id', () => {
        const label = makeLabel({ id: 'label-xyz-999' });
        const result = toStandardLabel(label);
        expect(result.id).toBe('label-xyz-999');
    });
});
