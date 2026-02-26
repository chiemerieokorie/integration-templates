import type { AtsJob } from '../../shared/models/ats/ats-job.js';

interface AshbyRawJob {
    id: string;
    title: string;
    status: string;
    employmentType: string;
    locationId: string;
    departmentId: string;
    customRequisitionId: string;
    hiringTeam: string[];
    updatedAt: string | Date;
    location: {
        id: string;
        name: string;
        isRemote: boolean;
        address?: {
            postalAddress?: {
                addressLocality?: string;
                addressRegion?: string;
                addressCountry?: string;
            };
        };
    } | null;
    openings: string[];
}

export function toAtsJob(job: AshbyRawJob): AtsJob {
    const updatedAt = job.updatedAt instanceof Date ? job.updatedAt.toISOString() : (job.updatedAt ?? null);

    return {
        id: job.id,
        title: job.title,
        status: job.status,
        department: null,
        location: job.location?.name ?? null,
        employmentType: job.employmentType ?? null,
        requisitionId: job.customRequisitionId ?? null,
        isRemote: job.location?.isRemote ?? null,
        url: null,
        tags: [],
        providerSpecific: {
            locationId: job.locationId,
            departmentId: job.departmentId,
            hiringTeam: job.hiringTeam,
            openings: job.openings
        },
        createdAt: null,
        updatedAt,
        closedAt: null
    };
}
