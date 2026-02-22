import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import type { GemCandidate } from '../types.js';

export function toStandardCandidate(candidate: GemCandidate): StandardCandidate {
    const emails: StandardCandidate['emails'] = (candidate.email_addresses ?? []).map((email) => ({
        value: email.value,
        type: email.type ?? null,
        isPrimary: email.is_primary ?? false
    }));

    const phoneNumbers: StandardCandidate['phoneNumbers'] = (candidate.phone_numbers ?? []).map((phone) => ({
        value: phone.value,
        type: phone.type ?? null
    }));

    const socialLinks: StandardCandidate['socialLinks'] = (candidate.social_media_addresses ?? [])
        .filter((addr) => Boolean(addr.value))
        .map((addr) => ({ type: 'url', url: addr.value }));

    const primaryAttachment = candidate.attachments?.find((a) => a.type === 'resume') ?? candidate.attachments?.[0];

    const applicationIds = candidate.application_ids ?? candidate.applications?.map((a) => a.id) ?? [];

    const source = candidate.applications?.[0]?.source?.public_name ?? null;

    return {
        id: candidate.id,
        firstName: candidate.first_name ?? '',
        lastName: candidate.last_name ?? '',
        emails,
        phoneNumbers,
        company: candidate.company ?? null,
        title: candidate.title ?? null,
        location: null,
        applicationIds,
        tags: candidate.tags ?? [],
        resumeUrl: primaryAttachment?.url ?? null,
        profileUrl: null,
        source,
        socialLinks,
        providerSpecific: {
            isPrivate: candidate.is_private,
            educations: candidate.educations,
            employments: candidate.employments
        },
        createdAt: candidate.created_at ?? null,
        updatedAt: candidate.updated_at ?? null
    };
}
