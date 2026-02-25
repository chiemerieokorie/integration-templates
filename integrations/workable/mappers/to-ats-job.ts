import type { AtsJob } from '../../shared/models/ats/ats-job.js';

interface WorkableRawJob {
    id: string;
    title: string;
    full_title: string;
    shortcode: string;
    code: string;
    state: string;
    department: string;
    url: string;
    application_url: string;
    shortlink: string;
    location: {
        location_str?: string;
        city?: string;
        region?: string;
        country?: string;
        telecommuting?: boolean;
        workplace_type?: string;
    } | null;
    created_at: string | Date;
}

function normalizeDate(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString();
    return val;
}

export function toAtsJob(job: WorkableRawJob): AtsJob {
    const locationStr =
        job.location?.city ??
        job.location?.location_str ??
        null;

    const isRemote =
        job.location?.telecommuting === true
            ? true
            : job.location?.workplace_type === 'remote'
              ? true
              : job.location?.workplace_type === 'onsite'
                ? false
                : null;

    return {
        id: job.id,
        title: job.title,
        status: job.state,
        department: job.department ?? null,
        location: locationStr,
        employmentType: null,
        requisitionId: job.code ?? null,
        isRemote,
        url: job.url ?? null,
        tags: [],
        providerSpecific: {
            shortcode: job.shortcode,
            full_title: job.full_title,
            application_url: job.application_url,
            shortlink: job.shortlink,
            location: job.location
        },
        createdAt: normalizeDate(job.created_at),
        updatedAt: null,
        closedAt: null
    };
}
