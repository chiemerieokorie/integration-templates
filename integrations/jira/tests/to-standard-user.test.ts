import { describe, it, expect } from 'vitest';
import { toStandardUser } from '../mappers/to-standard-user.js';
import type { User } from '../types.js';

function makeUser(overrides: Partial<User> = {}): User {
    return {
        self: 'https://api.atlassian.net/rest/api/3/user?accountId=user-1',
        accountId: 'user-1',
        displayName: 'Sam Rivera',
        emailAddress: 'sam@example.com',
        avatarUrls: {
            '48x48': 'https://avatar.example.com/48.png',
            '24x24': 'https://avatar.example.com/24.png',
            '16x16': 'https://avatar.example.com/16.png',
            '32x32': 'https://avatar.example.com/32.png'
        },
        active: true,
        timeZone: 'America/New_York',
        accountType: 'atlassian',
        ...overrides
    };
}

describe('toStandardUser', () => {
    it('splits display name "Sam Rivera" into firstName Sam, lastName Rivera', () => {
        const result = toStandardUser(makeUser({ displayName: 'Sam Rivera' }));
        expect(result.firstName).toBe('Sam');
        expect(result.lastName).toBe('Rivera');
    });

    it('handles single-word display name — firstName set, lastName null', () => {
        const result = toStandardUser(makeUser({ displayName: 'Sam' }));
        expect(result.firstName).toBe('Sam');
        expect(result.lastName).toBeNull();
    });

    it('handles multi-word last name "Mary Jane Watson"', () => {
        const result = toStandardUser(makeUser({ displayName: 'Mary Jane Watson' }));
        expect(result.firstName).toBe('Mary');
        expect(result.lastName).toBe('Jane Watson');
    });

    it('maps active: true to isActive: true', () => {
        const result = toStandardUser(makeUser({ active: true }));
        expect(result.isActive).toBe(true);
    });

    it('maps active: false to isActive: false', () => {
        const result = toStandardUser(makeUser({ active: false }));
        expect(result.isActive).toBe(false);
    });

    it('maps emailAddress to email, undefined becomes null', () => {
        const withEmail = toStandardUser(makeUser({ emailAddress: 'user@example.com' }));
        expect(withEmail.email).toBe('user@example.com');

        const withoutEmail = toStandardUser(makeUser({ emailAddress: undefined }));
        expect(withoutEmail.email).toBeNull();
    });

    it('maps avatarUrls 48x48 to avatarUrl', () => {
        const result = toStandardUser(makeUser());
        expect(result.avatarUrl).toBe('https://avatar.example.com/48.png');
    });

    it('puts accountType and timeZone in providerSpecific', () => {
        const result = toStandardUser(makeUser({ accountType: 'atlassian', timeZone: 'America/New_York' }));
        expect(result.providerSpecific).toStrictEqual({
            accountType: 'atlassian',
            timeZone: 'America/New_York'
        });
    });

    it('sets createdAt and updatedAt to null', () => {
        const result = toStandardUser(makeUser());
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('maps accountId to id', () => {
        const result = toStandardUser(makeUser({ accountId: 'abc-123' }));
        expect(result.id).toBe('abc-123');
    });
});
