import type { AtsApplication } from '../../shared/models/ats/ats-application.js';

interface WorkableRawJobsCandidate {
    id: string;
    job: {
        shortcode: string;
        title: string;
    } | null;
    stage: string;
    disqualified: boolean;
    disqualification_reason: string;
    hired_at: string | Date | null;
    sourced: boolean;
    profile_url: string;
    headline: string;
    created_at: string | Date;
    updated_at: string | Date | null;
}

function normalizeDate(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString();
    return val;
}

export function toAtsApplication(candidate: WorkableRawJobsCandidate): AtsApplication {
    const hiredAt = normalizeDate(candidate.hired_at);
    const status = candidate.disqualified ? 'rejected' : hiredAt ? 'hired' : 'active';

    return {
        id: candidate.id,
        candidateId: candidate.id,
        jobId: candidate.job?.shortcode ?? null,
        jobTitle: candidate.job?.title ?? null,
        status,
        stage: candidate.stage ?? null,
        stageId: null,
        source: candidate.sourced ? 'sourced' : null,
        appliedAt: normalizeDate(candidate.created_at),
        rejectedAt: candidate.disqualified ? normalizeDate(candidate.updated_at) : null,
        lastActivityAt: normalizeDate(candidate.updated_at),
        rejectionReason: candidate.disqualification_reason ?? null,
        providerSpecific: {
            hired_at: hiredAt,
            profile_url: candidate.profile_url,
            headline: candidate.headline
        },
        createdAt: normalizeDate(candidate.created_at),
        updatedAt: normalizeDate(candidate.updated_at)
    };
}
