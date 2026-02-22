import type { GithubLabel } from '../models/index.js';
import type { StandardLabel } from '../models/index.js';

export function toStandardLabel(label: GithubLabel, owner: string, repo: string): StandardLabel {
    return {
        id: label.id.toString(),
        name: label.name,
        color: `#${label.color}`,
        description: label.description ?? null,
        teamId: `${owner}/${repo}`,
        providerSpecific: {
            default: label.default
        },
        createdAt: null,
        updatedAt: null
    };
}
