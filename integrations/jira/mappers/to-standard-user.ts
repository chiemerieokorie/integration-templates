import type { User } from '../types.js';
import type { StandardUser } from '../models/index.js';

function splitName(fullName: string): { firstName: string; lastName: string | null } {
    const idx = fullName.indexOf(' ');
    if (idx === -1) return { firstName: fullName, lastName: null };
    return { firstName: fullName.slice(0, idx), lastName: fullName.slice(idx + 1) };
}

export function toStandardUser(user: User): StandardUser {
    const { firstName, lastName } = splitName(user.displayName);
    return {
        id: user.accountId,
        displayName: user.displayName,
        firstName,
        lastName,
        email: user.emailAddress ?? null,
        avatarUrl: user.avatarUrls['48x48'] ?? null,
        isActive: user.active,
        providerSpecific: {
            accountType: user.accountType,
            timeZone: user.timeZone
        },
        createdAt: null,
        updatedAt: null
    };
}
