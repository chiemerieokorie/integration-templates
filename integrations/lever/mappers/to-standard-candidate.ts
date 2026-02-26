import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';

interface LeverRawOpportunity {
    id: string;
    name: string;
    headline: string;
    emails: string[];
    phones: Array<string | { value: string; type: string }>;
    sources: string[];
    resume: string;
    urls: { list: string; show: string };
    tags: string[];
    applications: string[];
    location: string;
    opportunityLocation: string;
    links: string[];
    createdAt: number;
    updatedAt: number;
    stage: string;
    owner: string;
    confidentiality: string;
    origin: string;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = (fullName ?? '').trim().split(/\s+/);
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
}

function msToIso(ms: number | null | undefined): string | null {
    if (!ms) return null;
    return new Date(ms).toISOString();
}

export function toStandardCandidate(opportunity: LeverRawOpportunity): StandardCandidate {
    const { firstName, lastName } = splitName(opportunity.name);

    const emails: StandardCandidate['emails'] = (opportunity.emails ?? []).map((email, idx) => ({
        value: typeof email === 'string' ? email : email,
        type: null,
        isPrimary: idx === 0
    }));

    const phoneNumbers: StandardCandidate['phoneNumbers'] = (opportunity.phones ?? []).map((phone) => {
        if (typeof phone === 'string') {
            return { value: phone, type: null };
        }
        return { value: phone.value, type: phone.type ?? null };
    });

    const socialLinks: StandardCandidate['socialLinks'] = (opportunity.links ?? [])
        .filter(Boolean)
        .map((link) => ({ type: 'url', url: link }));

    return {
        id: opportunity.id,
        firstName,
        lastName,
        emails,
        phoneNumbers,
        company: null,
        title: opportunity.headline ?? null,
        location: opportunity.opportunityLocation ?? opportunity.location ?? null,
        applicationIds: opportunity.applications ?? [],
        tags: opportunity.tags ?? [],
        resumeUrl: opportunity.resume ?? null,
        profileUrl: opportunity.urls?.show ?? null,
        source: opportunity.sources?.[0] ?? null,
        socialLinks,
        providerSpecific: {
            stage: opportunity.stage,
            owner: opportunity.owner,
            confidentiality: opportunity.confidentiality,
            origin: opportunity.origin
        },
        createdAt: msToIso(opportunity.createdAt),
        updatedAt: msToIso(opportunity.updatedAt)
    };
}
