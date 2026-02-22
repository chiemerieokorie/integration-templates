import type { GithubUser } from '../models/index.js';
import type { StandardUser } from '../models/index.js';

export function toStandardUser(user: GithubUser): StandardUser {
    return {
        id: user.id.toString(),
        displayName: user.login,
        firstName: null,
        lastName: null,
        email: null,
        avatarUrl: user.avatar_url,
        isActive: null,
        providerSpecific: {
            login: user.login,
            type: user.type,
            siteAdmin: user.site_admin
        },
        createdAt: null,
        updatedAt: null
    };
}
