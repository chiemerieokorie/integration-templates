import { describe, it, expect } from 'vitest';
import { toStandardUser } from '../mappers/to-standard-user.js';
import type { LinearUser } from '../models/index.js';

function makeUser(overrides: Partial<LinearUser> = {}): LinearUser {
    return {
        id: 'user-1',
        admin: false,
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        avatarUrl: 'https://example.com/alice.png',
        ...overrides
    };
}

describe('toStandardUser', () => {
    it('maps a user with first and last name to displayName "First Last"', () => {
        const user = makeUser({ firstName: 'Alice', lastName: 'Smith' });
        const result = toStandardUser(user);
        expect(result.displayName).toBe('Alice Smith');
    });

    it('maps a user with only firstName (no lastName) to displayName = firstName', () => {
        const user = makeUser({ lastName: undefined });
        const result = toStandardUser(user);
        expect(result.displayName).toBe('Alice');
    });

    it('falls back to email for displayName when firstName and lastName are empty strings', () => {
        const user = makeUser({ firstName: '', lastName: undefined });
        const result = toStandardUser(user);
        expect(result.displayName).toBe('alice@example.com');
    });

    it('places admin flag in providerSpecific', () => {
        const user = makeUser({ admin: true });
        const result = toStandardUser(user);
        expect(result.providerSpecific).toStrictEqual({ admin: true });
    });

    it('places admin: false in providerSpecific for non-admin users', () => {
        const user = makeUser({ admin: false });
        const result = toStandardUser(user);
        expect(result.providerSpecific).toStrictEqual({ admin: false });
    });

    it('maps null avatarUrl to null', () => {
        const user = makeUser({ avatarUrl: null });
        const result = toStandardUser(user);
        expect(result.avatarUrl).toBeNull();
    });

    it('always sets createdAt and updatedAt to null', () => {
        const user = makeUser();
        const result = toStandardUser(user);
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('maps a full user to StandardUser correctly', () => {
        const user = makeUser();
        const result = toStandardUser(user);

        expect(result).toStrictEqual({
            id: 'user-1',
            displayName: 'Alice Smith',
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            avatarUrl: 'https://example.com/alice.png',
            isActive: null,
            providerSpecific: { admin: false },
            createdAt: null,
            updatedAt: null
        });
    });

    it('sets isActive to null always', () => {
        const user = makeUser();
        const result = toStandardUser(user);
        expect(result.isActive).toBeNull();
    });
});
