import type { AtsApplication } from '../../shared/models/ats/ats-application.js';

interface LeverRawApplication {
    id: string;
    opportunityId: string;
    candidateId: string;
    createdAt: number;
    type: string;
    posting: string;
    postingHiringManager: string;
    postingOwner: string;
    user: string;
    name: string;
    email: string;
    archived: {
        reason: string;
        archivedAt: number;
    } | null;
}

function msToIso(ms: number | null | undefined): string | null {
    if (!ms) return null;
    return new Date(ms).toISOString();
}

export function toAtsApplication(application: LeverRawApplication): AtsApplication {
    const isRejected = Boolean(application.archived?.reason);

    return {
        id: application.id,
        candidateId: application.opportunityId,
        jobId: application.posting ?? null,
        jobTitle: null,
        status: isRejected ? 'rejected' : 'active',
        stage: null,
        stageId: null,
        source: null,
        appliedAt: msToIso(application.createdAt),
        rejectedAt: isRejected ? msToIso(application.archived?.archivedAt) : null,
        lastActivityAt: null,
        rejectionReason: application.archived?.reason ?? null,
        providerSpecific: {
            type: application.type,
            postingHiringManager: application.postingHiringManager,
            postingOwner: application.postingOwner
        },
        createdAt: msToIso(application.createdAt),
        updatedAt: null
    };
}
