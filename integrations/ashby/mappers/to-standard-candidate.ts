import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';

interface AshbyEmailAddress {
    value: string;
    type: string;
    isPrimary: boolean;
}

interface AshbyPhoneNumber {
    value: string;
    type: string;
    isPrimary: boolean;
}

interface AshbySocialLink {
    type: string;
    url: string;
}

interface AshbyTag {
    id: string;
    title: string;
    isArchived: boolean;
}

interface AshbyRawCandidate {
    id: string;
    name: string;
    createdAt: string | Date;
    primaryEmailAddress: AshbyEmailAddress | null;
    emailAddresses: Array<AshbyEmailAddress | string>;
    primaryPhoneNumber: AshbyPhoneNumber | null;
    phoneNumbers: Array<AshbyPhoneNumber | string>;
    socialLinks: Array<AshbySocialLink | string>;
    tags: Array<AshbyTag | string>;
    applicationIds: string[];
    resumeFileHandle: { handle: string; id: string; name: string } | null;
    profileUrl: string;
    source: { id: string; title: string; isArchived: boolean } | null;
    position: string;
    company: string;
    school: string;
    creditedToUser: { id: string; firstName: string; lastName: string; email: string } | null;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = (fullName ?? '').trim().split(/\s+/);
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
}

function normalizeEmail(raw: AshbyEmailAddress | string): { value: string; type: string | null; isPrimary: boolean } {
    if (typeof raw === 'string') {
        return { value: raw, type: null, isPrimary: false };
    }
    return { value: raw.value, type: raw.type ?? null, isPrimary: raw.isPrimary ?? false };
}

function normalizePhone(raw: AshbyPhoneNumber | string): { value: string; type: string | null } {
    if (typeof raw === 'string') {
        return { value: raw, type: null };
    }
    return { value: raw.value, type: raw.type ?? null };
}

function normalizeSocialLink(raw: AshbySocialLink | string): { type: string; url: string } | null {
    if (typeof raw === 'string') {
        return raw ? { type: 'url', url: raw } : null;
    }
    return raw.url ? { type: raw.type ?? 'url', url: raw.url } : null;
}

function normalizeTag(raw: AshbyTag | string): string {
    if (typeof raw === 'string') return raw;
    return raw.title ?? '';
}

export function toStandardCandidate(candidate: AshbyRawCandidate): StandardCandidate {
    const { firstName, lastName } = splitName(candidate.name);

    const emails: StandardCandidate['emails'] = [];
    if (candidate.primaryEmailAddress) {
        emails.push({
            value: candidate.primaryEmailAddress.value,
            type: candidate.primaryEmailAddress.type ?? null,
            isPrimary: true
        });
    }
    for (const email of candidate.emailAddresses ?? []) {
        const normalized = normalizeEmail(email);
        if (!emails.some((e) => e.value === normalized.value)) {
            emails.push({ ...normalized, isPrimary: false });
        }
    }

    const phoneNumbers: StandardCandidate['phoneNumbers'] = [];
    if (candidate.primaryPhoneNumber) {
        phoneNumbers.push({
            value: candidate.primaryPhoneNumber.value,
            type: candidate.primaryPhoneNumber.type ?? null
        });
    }
    for (const phone of candidate.phoneNumbers ?? []) {
        const normalized = normalizePhone(phone);
        if (!phoneNumbers.some((p) => p.value === normalized.value)) {
            phoneNumbers.push(normalized);
        }
    }

    const socialLinks = (candidate.socialLinks ?? []).map(normalizeSocialLink).filter((s): s is { type: string; url: string } => s !== null);

    const tags = (candidate.tags ?? []).map(normalizeTag).filter(Boolean);

    const createdAt = candidate.createdAt instanceof Date ? candidate.createdAt.toISOString() : (candidate.createdAt ?? null);

    return {
        id: candidate.id,
        firstName,
        lastName,
        emails,
        phoneNumbers,
        company: candidate.company ?? null,
        title: candidate.position ?? null,
        location: null,
        applicationIds: candidate.applicationIds ?? [],
        tags,
        resumeUrl: candidate.resumeFileHandle?.handle ?? null,
        profileUrl: candidate.profileUrl ?? null,
        source: candidate.source?.title ?? null,
        socialLinks,
        providerSpecific: {
            school: candidate.school,
            creditedToUser: candidate.creditedToUser
        },
        createdAt,
        updatedAt: null
    };
}
