import { describe, it, expect } from 'vitest';
import { toStandardUser } from '../mappers/to-standard-user.js';
import type { AsanaUser } from '../models/index.js';

function makeUser(overrides: Partial<AsanaUser> = {}): AsanaUser {
    return {
        gid: 'user-gid-1',
        resource_type: 'user',
        name: 'Alex Johnson',
        id: 'user-id-1',
        email: 'alex@example.com',
        photo: null,
        workspace: 'ws-gid-1',
        ...overrides
    };
}

describe('toStandardUser', () => {
    it('splits "Alex Johnson" into firstName "Alex" and lastName "Johnson"', () => {
        const user = makeUser({ name: 'Alex Johnson' });
        const result = toStandardUser(user);
        expect(result.firstName).toBe('Alex');
        expect(result.lastName).toBe('Johnson');
    });

    it('splits a single-word name into firstName with null lastName', () => {
        const user = makeUser({ name: 'Alex' });
        const result = toStandardUser(user);
        expect(result.firstName).toBe('Alex');
        expect(result.lastName).toBeNull();
    });

    it('splits "Alex van den Berg" into firstName "Alex" and lastName "van den Berg"', () => {
        const user = makeUser({ name: 'Alex van den Berg' });
        const result = toStandardUser(user);
        expect(result.firstName).toBe('Alex');
        expect(result.lastName).toBe('van den Berg');
    });

    it('maps gid to id', () => {
        const user = makeUser({ gid: 'user-gid-55' });
        const result = toStandardUser(user);
        expect(result.id).toBe('user-gid-55');
    });

    it('sets displayName to the full name', () => {
        const user = makeUser({ name: 'Alex Johnson' });
        const result = toStandardUser(user);
        expect(result.displayName).toBe('Alex Johnson');
    });

    it('maps email correctly', () => {
        const user = makeUser({ email: 'alex@example.com' });
        const result = toStandardUser(user);
        expect(result.email).toBe('alex@example.com');
    });

    it('sets avatarUrl from photo.image_128x128 when photo is present', () => {
        const user = makeUser({
            photo: {
                image_128x128: 'https://cdn.asana.com/photos/128x128.jpg',
                image_1024x1024: 'https://cdn.asana.com/photos/1024x1024.jpg',
                image_21x21: 'https://cdn.asana.com/photos/21x21.jpg',
                image_27x27: 'https://cdn.asana.com/photos/27x27.jpg',
                image_36x36: 'https://cdn.asana.com/photos/36x36.jpg',
                image_60x60: 'https://cdn.asana.com/photos/60x60.jpg'
            }
        });
        const result = toStandardUser(user);
        expect(result.avatarUrl).toBe('https://cdn.asana.com/photos/128x128.jpg');
    });

    it('sets avatarUrl to null when photo is null', () => {
        const user = makeUser({ photo: null });
        const result = toStandardUser(user);
        expect(result.avatarUrl).toBeNull();
    });

    it('sets isActive to null (not available from Asana API)', () => {
        const user = makeUser();
        const result = toStandardUser(user);
        expect(result.isActive).toBeNull();
    });

    it('sets createdAt and updatedAt to null', () => {
        const user = makeUser();
        const result = toStandardUser(user);
        expect(result.createdAt).toBeNull();
        expect(result.updatedAt).toBeNull();
    });

    it('puts workspaceGid in providerSpecific', () => {
        const user = makeUser({ workspace: 'ws-gid-abc' });
        const result = toStandardUser(user);
        expect(result.providerSpecific).toStrictEqual({ workspaceGid: 'ws-gid-abc' });
    });

    it('maps the full user correctly', () => {
        const user = makeUser({
            gid: 'gid-full-user',
            name: 'Jane Smith',
            id: 'id-full-user',
            email: 'jane@example.com',
            photo: {
                image_128x128: 'https://cdn.asana.com/jane/128x128.jpg',
                image_1024x1024: 'https://cdn.asana.com/jane/1024x1024.jpg',
                image_21x21: 'https://cdn.asana.com/jane/21x21.jpg',
                image_27x27: 'https://cdn.asana.com/jane/27x27.jpg',
                image_36x36: 'https://cdn.asana.com/jane/36x36.jpg',
                image_60x60: 'https://cdn.asana.com/jane/60x60.jpg'
            },
            workspace: 'ws-gid-main'
        });
        const result = toStandardUser(user);
        expect(result).toStrictEqual({
            id: 'gid-full-user',
            displayName: 'Jane Smith',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            avatarUrl: 'https://cdn.asana.com/jane/128x128.jpg',
            isActive: null,
            providerSpecific: { workspaceGid: 'ws-gid-main' },
            createdAt: null,
            updatedAt: null
        });
    });
});
