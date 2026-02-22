import type { LinearLabel } from '../models/index.js';
import type { StandardLabel } from '../models/index.js';

export function toStandardLabel(label: LinearLabel): StandardLabel {
    return {
        id: label.id,
        name: label.name,
        color: label.color,
        description: null,
        teamId: label.team?.id ?? null,
        providerSpecific: {},
        createdAt: new Date(label.createdAt).toISOString(),
        updatedAt: new Date(label.updatedAt).toISOString()
    };
}
