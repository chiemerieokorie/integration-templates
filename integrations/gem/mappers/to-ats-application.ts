import type { AtsApplication } from '../../shared/models/ats/ats-application.js';
import type { GemApplication } from '../types.js';

export function toAtsApplication(application: GemApplication): AtsApplication {
    return {
        id: application.id,
        candidateId: application.candidate_id,
        jobId: application.jobs?.[0]?.id ?? null,
        jobTitle: application.jobs?.[0]?.name ?? null,
        status: application.status,
        stage: application.current_stage?.name ?? null,
        stageId: application.current_stage?.id ?? null,
        source: application.source?.public_name ?? null,
        appliedAt: application.applied_at ?? null,
        rejectedAt: application.rejected_at ?? null,
        lastActivityAt: application.last_activity_at ?? null,
        rejectionReason: application.rejection_reason?.name ?? null,
        providerSpecific: {
            credited_to: application.credited_to,
            job_post_id: application.job_post_id
        },
        createdAt: application.applied_at ?? null,
        updatedAt: application.last_activity_at ?? null
    };
}
