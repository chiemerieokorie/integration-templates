import type { LinearUser } from '../models/index.js';
import type { StandardUser } from '../models/index.js';

export function toStandardUser(user: LinearUser): StandardUser {
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
    return {
        id: user.id,
        displayName,
        firstName: user.firstName,
        lastName: user.lastName ?? null,
        email: user.email,
        avatarUrl: user.avatarUrl ?? null,
        isActive: null,
        providerSpecific: {
            admin: user.admin
        },
        createdAt: null,
        updatedAt: null
    };
}
