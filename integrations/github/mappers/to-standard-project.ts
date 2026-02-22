import type { StandardProject } from '../models/index.js';

interface GithubRepoRaw {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    archived: boolean;
    owner: { id: number; login: string };
    created_at: string;
    updated_at: string;
}

export function toStandardProject(repo: GithubRepoRaw): StandardProject {
    return {
        id: `${repo.owner.login}/${repo.name}`,
        name: repo.name,
        description: repo.description ?? null,
        status: repo.archived ? 'COMPLETED' : 'ACTIVE',
        startDate: null,
        targetDate: null,
        ownerId: repo.owner.id.toString(),
        teamId: null,
        url: repo.html_url,
        providerSpecific: {
            fullName: repo.full_name,
            owner: repo.owner.login,
            repo: repo.name
        },
        createdAt: new Date(repo.created_at).toISOString(),
        updatedAt: new Date(repo.updated_at).toISOString()
    };
}
