import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';

interface WorkableRawCandidate {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    profile_url: string;
    stage: string;
    sourced: boolean;
    created_at: string | Date;
    updated_at: string | Date;
    address: string;
    headline: string;
    job: { shortcode: string; title: string } | null;
    disqualified: boolean;
    disqualification_reason: string;
}

function normalizeDate(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString();
    return val;
}

export function toStandardCandidate(candidate: WorkableRawCandidate): StandardCandidate {
    const emails: StandardCandidate['emails'] = candidate.email
        ? [{ value: candidate.email, type: null, isPrimary: true }]
        : [];

    const phoneNumbers: StandardCandidate['phoneNumbers'] = candidate.phone
        ? [{ value: candidate.phone, type: null }]
        : [];

    return {
        id: candidate.id,
        firstName: candidate.firstname ?? '',
        lastName: candidate.lastname ?? '',
        emails,
        phoneNumbers,
        company: null,
        title: candidate.headline ?? null,
        location: candidate.address ?? null,
        applicationIds: [],
        tags: [],
        resumeUrl: null,
        profileUrl: candidate.profile_url ?? null,
        source: candidate.sourced ? 'sourced' : null,
        socialLinks: [],
        providerSpecific: {
            stage: candidate.stage,
            disqualified: candidate.disqualified,
            disqualificationReason: candidate.disqualification_reason,
            jobShortcode: candidate.job?.shortcode
        },
        createdAt: normalizeDate(candidate.created_at),
        updatedAt: normalizeDate(candidate.updated_at)
    };
}
