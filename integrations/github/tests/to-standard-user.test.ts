import { describe, it, expect } from 'vitest';
import { toStandardUser } from '../mappers/to-standard-user.js';

const baseUser = {
    id: 1234567,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    type: 'User' as const,
    site_admin: false
};

describe('toStandardUser', () => {
    it('converts numeric id to string', () => {
        const result = toStandardUser({ ...baseUser, id: 9876543 });
        expect(result.id).toBe('9876543');
    });

    it('sets displayName to login (no real name available)', () => {
        const result = toStandardUser(baseUser);
        expect(result.displayName).toBe('octocat');
    });

    it('sets firstName to null', () => {
        const result = toStandardUser(baseUser);
        expect(result.firstName).toBeNull();
    });

    it('sets lastName to null', () => {
        const result = toStandardUser(baseUser);
        expect(result.lastName).toBeNull();
    });

    it('sets email to null', () => {
        const result = toStandardUser(baseUser);
        expect(result.email).toBeNull();
    });

    it('maps avatar_url to avatarUrl', () => {
        const result = toStandardUser(baseUser);
        expect(result.avatarUrl).toBe('https://avatars.githubusercontent.com/u/1234567?v=4');
    });

    it('sets isActive to null', () => {
        const result = toStandardUser(baseUser);
        expect(result.isActive).toBeNull();
    });

    it('includes login, type, and siteAdmin in providerSpecific', () => {
        const result = toStandardUser({ ...baseUser, type: 'Bot', site_admin: true });
        expect(result.providerSpecific).toStrictEqual({
            login: 'octocat',
            type: 'Bot',
            siteAdmin: true
        });
    });

    it('sets createdAt and updatedAt to null', () => {
        const result = toStandardUser(baseUser);
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('returns a fully mapped StandardUser object', () => {
        const result = toStandardUser(baseUser);
        expect(result).toStrictEqual({
            id: '1234567',
            displayName: 'octocat',
            firstName: null,
            lastName: null,
            email: null,
            avatarUrl: 'https://avatars.githubusercontent.com/u/1234567?v=4',
            isActive: null,
            providerSpecific: {
                login: 'octocat',
                type: 'User',
                siteAdmin: false
            },
            createdAt: null,
            updatedAt: null
        });
    });

    it('handles Organization type users', () => {
        const orgUser = { ...baseUser, type: 'Organization' as const };
        const result = toStandardUser(orgUser);
        expect(result.providerSpecific['type']).toBe('Organization');
    });
});
