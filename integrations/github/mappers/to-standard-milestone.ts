import type { GithubMilestone } from '../models/index.js';
import type { StandardMilestone } from '../models/index.js';

export function toStandardMilestone(milestone: GithubMilestone, owner: string, repo: string): StandardMilestone {
    const total = milestone.open_issues + milestone.closed_issues;
    const progress = total > 0 ? Math.round((milestone.closed_issues / total) * 100) : null;

    return {
        id: milestone.id.toString(),
        name: milestone.title,
        description: milestone.description ?? null,
        status: milestone.state === 'closed' ? 'COMPLETED' : 'ACTIVE',
        projectId: `${owner}/${repo}`,
        startDate: null,
        targetDate: milestone.due_on ? new Date(milestone.due_on).toISOString() : null,
        completedAt: milestone.closed_at ? new Date(milestone.closed_at).toISOString() : null,
        progress,
        providerSpecific: {
            number: milestone.number,
            htmlUrl: milestone.html_url,
            openIssues: milestone.open_issues,
            closedIssues: milestone.closed_issues
        },
        createdAt: new Date(milestone.created_at).toISOString(),
        updatedAt: new Date(milestone.updated_at).toISOString()
    };
}
