import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';

interface TeamtailorAttributes {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    resume: string;
    linkedin_url: string;
    linkedin_profile: string;
    facebook_profile: string;
    created_at: string | Date;
    updated_at: string | Date;
    tags: unknown[];
    sourced: boolean;
    picture: string;
}

interface TeamtailorRawCandidate {
    id: string;
    type: string;
    attributes: TeamtailorAttributes;
}

function normalizeDate(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString();
    return val;
}

export function toStandardCandidate(candidate: TeamtailorRawCandidate): StandardCandidate {
    const attrs = candidate.attributes;

    const emails: StandardCandidate['emails'] = attrs.email
        ? [{ value: attrs.email, type: null, isPrimary: true }]
        : [];

    const phoneNumbers: StandardCandidate['phoneNumbers'] = attrs.phone
        ? [{ value: attrs.phone, type: null }]
        : [];

    const socialLinks: StandardCandidate['socialLinks'] = [];
    if (attrs.linkedin_url) {
        socialLinks.push({ type: 'linkedin', url: attrs.linkedin_url });
    } else if (attrs.linkedin_profile) {
        socialLinks.push({ type: 'linkedin', url: attrs.linkedin_profile });
    }
    if (attrs.facebook_profile) {
        socialLinks.push({ type: 'facebook', url: attrs.facebook_profile });
    }

    return {
        id: candidate.id,
        firstName: attrs.first_name ?? '',
        lastName: attrs.last_name ?? '',
        emails,
        phoneNumbers,
        company: null,
        title: null,
        location: null,
        applicationIds: [],
        tags: [],
        resumeUrl: attrs.resume ?? null,
        profileUrl: null,
        source: attrs.sourced ? 'sourced' : null,
        socialLinks,
        providerSpecific: {
            pictureUrl: attrs.picture,
            type: candidate.type
        },
        createdAt: normalizeDate(attrs.created_at),
        updatedAt: normalizeDate(attrs.updated_at)
    };
}
