import type { AsanaUser } from '../models/index.js';
import type { StandardUser } from '../models/index.js';

function splitName(fullName: string): { firstName: string; lastName: string | null } {
    const idx = fullName.indexOf(' ');
    if (idx === -1) return { firstName: fullName, lastName: null };
    return { firstName: fullName.slice(0, idx), lastName: fullName.slice(idx + 1) };
}

export function toStandardUser(user: AsanaUser): StandardUser {
    const { firstName, lastName } = splitName(user.name);
    return {
        id: user.gid,
        displayName: user.name,
        firstName,
        lastName,
        email: user.email,
        avatarUrl: user.photo?.image_128x128 ?? null,
        isActive: null,
        providerSpecific: {
            workspaceGid: user.workspace
        },
        createdAt: null,
        updatedAt: null
    };
}
