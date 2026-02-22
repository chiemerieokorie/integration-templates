import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';

interface GreenhouseEmailAddress {
    value: string;
    type: string;
    primary?: boolean;
}

interface GreenhousePhoneNumber {
    value: string;
    type: string;
}

interface GreenhouseSocialAddress {
    value: string;
}

interface GreenhouseRawCandidate {
    id: string | number;
    first_name: string;
    last_name: string;
    company: string;
    title: string;
    created_at: string | Date;
    updated_at: string | Date;
    application_ids: string[];
    tags: string[];
    email_addresses: Array<GreenhouseEmailAddress | string>;
    phone_numbers: Array<GreenhousePhoneNumber | string>;
    social_media_addresses: Array<GreenhouseSocialAddress | string>;
    photo_url: string;
    recruiter: { id: string; first_name: string; last_name: string; name: string } | null;
    coordinator: { id: string; first_name: string; last_name: string; name: string } | null;
}

function normalizeDate(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString();
    return val;
}

export function toStandardCandidate(candidate: GreenhouseRawCandidate): StandardCandidate {
    const emails: StandardCandidate['emails'] = (candidate.email_addresses ?? []).map((email) => {
        if (typeof email === 'string') {
            return { value: email, type: null, isPrimary: false };
        }
        return {
            value: email.value,
            type: email.type ?? null,
            isPrimary: email.primary ?? false
        };
    });

    const phoneNumbers: StandardCandidate['phoneNumbers'] = (candidate.phone_numbers ?? []).map((phone) => {
        if (typeof phone === 'string') {
            return { value: phone, type: null };
        }
        return { value: phone.value, type: phone.type ?? null };
    });

    const socialLinks: StandardCandidate['socialLinks'] = (candidate.social_media_addresses ?? [])
        .map((addr) => {
            const url = typeof addr === 'string' ? addr : addr.value;
            return url ? { type: 'url', url } : null;
        })
        .filter((s): s is { type: string; url: string } => s !== null);

    return {
        id: String(candidate.id),
        firstName: candidate.first_name ?? '',
        lastName: candidate.last_name ?? '',
        emails,
        phoneNumbers,
        company: candidate.company ?? null,
        title: candidate.title ?? null,
        location: null,
        applicationIds: (candidate.application_ids ?? []).map(String),
        tags: candidate.tags ?? [],
        resumeUrl: null,
        profileUrl: null,
        source: null,
        socialLinks,
        providerSpecific: {
            photoUrl: candidate.photo_url,
            recruiter: candidate.recruiter,
            coordinator: candidate.coordinator
        },
        createdAt: normalizeDate(candidate.created_at),
        updatedAt: normalizeDate(candidate.updated_at)
    };
}
