import type { AsanaTag } from '../models/index.js';
import type { StandardLabel } from '../models/index.js';

export function toStandardLabel(tag: AsanaTag): StandardLabel {
    return {
        id: tag.gid,
        name: tag.name,
        color: null, // Asana uses named colors, not hex — not normalizable without a lookup table
        description: null,
        teamId: tag.workspace.gid,
        providerSpecific: {
            colorName: tag.color
        },
        createdAt: tag.created_at ?? null,
        updatedAt: null
    };
}
