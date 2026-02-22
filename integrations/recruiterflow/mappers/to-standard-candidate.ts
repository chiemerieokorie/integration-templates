import type { StandardCandidate } from '../../shared/models/ats/standard-candidate.js';
import type { RecruiterFlowCandidateResponse } from '../types.js';

export function toStandardCandidate(record: RecruiterFlowCandidateResponse): StandardCandidate {
    const emails: StandardCandidate['emails'] = (record.email ?? []).map((email, idx) => ({
        value: email,
        type: null,
        isPrimary: idx === 0
    }));

    const phoneNumbers: StandardCandidate['phoneNumbers'] = (record.phone_number ?? []).map((phone) => ({
        value: phone,
        type: null
    }));

    const socialLinks: StandardCandidate['socialLinks'] = [];
    if (record.linkedin_profile && record.linkedin_profile !== 'None') {
        socialLinks.push({ type: 'linkedin', url: record.linkedin_profile });
    }
    if (record.github_profile && record.github_profile !== 'None') {
        socialLinks.push({ type: 'github', url: record.github_profile });
    }
    if (record.twitter_profile && record.twitter_profile !== 'None') {
        socialLinks.push({ type: 'twitter', url: record.twitter_profile });
    }
    if (record.angellist_profile && record.angellist_profile !== 'None') {
        socialLinks.push({ type: 'angellist', url: record.angellist_profile });
    }
    if (record.facebook_profile && record.facebook_profile !== 'None') {
        socialLinks.push({ type: 'facebook', url: record.facebook_profile });
    }

    const resumeFile = record.files?.[0];
    const resumeUrl = resumeFile?.link ?? null;

    const applicationIds = (record.jobs ?? []).map((job) => String(job.job_id));

    const location = record.location?.location ?? null;

    return {
        id: String(record.id),
        firstName: record.first_name ?? '',
        lastName: record.last_name ?? '',
        emails,
        phoneNumbers,
        company: record.current_organization ?? null,
        title: record.current_designation ?? null,
        location,
        applicationIds,
        tags: [],
        resumeUrl,
        profileUrl: null,
        source: record.source_name ?? null,
        socialLinks,
        providerSpecific: {
            addedById: record.added_by?.id,
            addedByName: record.added_by?.name,
            latestActivityTime: record.latest_activity_time,
            statusName: record.status?.name
        },
        createdAt: record.added_time ?? null,
        updatedAt: record.latest_activity_time ?? null
    };
}
