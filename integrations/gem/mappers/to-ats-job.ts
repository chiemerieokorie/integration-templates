import type { AtsJob } from '../../shared/models/ats/ats-job.js';
import type { GemJob } from '../types.js';

export function toAtsJob(job: GemJob): AtsJob {
    return {
        id: job.id,
        title: job.name,
        status: job.status,
        department: job.departments?.[0]?.name ?? null,
        location: job.offices?.[0]?.location?.name ?? null,
        employmentType: null,
        requisitionId: job.requisition_id ?? null,
        isRemote: null,
        url: null,
        tags: [],
        providerSpecific: {
            confidential: job.confidential,
            is_template: job.is_template,
            departments: job.departments,
            offices: job.offices,
            hiring_team: job.hiring_team
        },
        createdAt: job.created_at ?? null,
        updatedAt: job.updated_at ?? null,
        closedAt: job.closed_at ?? null
    };
}
