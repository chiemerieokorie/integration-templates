import type { AtsJob } from '../../shared/models/ats/ats-job.js';

interface LeverRawPosting {
    id: string;
    text: string;
    createdAt: number;
    updatedAt: number;
    state: string;
    categories: {
        team?: string;
        department?: string;
        location?: string;
        commitment?: string;
        level?: string;
    };
    tags: string[];
    reqCode: string;
    requisitionCodes: string[];
    urls: {
        list?: string;
        show?: string;
        apply?: string;
    };
    workplaceType: string;
    confidentiality: string;
    salaryRange?: {
        max: number;
        min: number;
        currency: string;
        interval: string;
    };
}

function msToIso(ms: number | null | undefined): string | null {
    if (!ms) return null;
    return new Date(ms).toISOString();
}

export function toAtsJob(posting: LeverRawPosting): AtsJob {
    const isRemote =
        posting.workplaceType === 'remote' ? true : posting.workplaceType === 'onsite' ? false : null;

    return {
        id: posting.id,
        title: posting.text,
        status: posting.state,
        department: posting.categories?.team ?? posting.categories?.department ?? null,
        location: posting.categories?.location ?? null,
        employmentType: posting.categories?.commitment ?? null,
        requisitionId: posting.reqCode ?? posting.requisitionCodes?.[0] ?? null,
        isRemote,
        url: posting.urls?.apply ?? posting.urls?.show ?? null,
        tags: posting.tags ?? [],
        providerSpecific: {
            confidentiality: posting.confidentiality,
            salaryRange: posting.salaryRange ?? null
        },
        createdAt: msToIso(posting.createdAt),
        updatedAt: msToIso(posting.updatedAt),
        closedAt: null
    };
}
