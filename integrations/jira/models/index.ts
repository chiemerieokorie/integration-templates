// Jira provider models
export { Timestamps, Author, Comment, Issue } from './jira-issue.js';
export type { Timestamps, Author, Comment, Issue } from './jira-issue.js';

export { Project } from './jira-project.js';
export type { Project } from './jira-project.js';

export { JiraProjectId, JiraIssueMetadata, IssueType, CreateIssueInput, CreateIssueOutput } from './jira-issue-type.js';
export type { JiraProjectId, JiraIssueMetadata, IssueType, CreateIssueInput, CreateIssueOutput } from './jira-issue-type.js';

export { JiraFixVersion } from './jira-fix-version.js';
export type { JiraFixVersion } from './jira-fix-version.js';

export { JiraSprint } from './jira-sprint.js';
export type { JiraSprint } from './jira-sprint.js';

// Standard unified models
export { StandardTask } from './standard-task.js';
export type { StandardTask } from './standard-task.js';

export { StandardProject } from './standard-project.js';
export type { StandardProject } from './standard-project.js';

export { StandardTeam } from './standard-team.js';
export type { StandardTeam } from './standard-team.js';

export { StandardUser } from './standard-user.js';
export type { StandardUser } from './standard-user.js';

export { StandardMilestone } from './standard-milestone.js';
export type { StandardMilestone } from './standard-milestone.js';

export { StandardCycle } from './standard-cycle.js';
export type { StandardCycle } from './standard-cycle.js';

export { StandardComment } from './standard-comment.js';
export type { StandardComment } from './standard-comment.js';

// Models registry
import { Timestamps, Author, Comment, Issue } from './jira-issue.js';
import { Project } from './jira-project.js';
import { JiraProjectId, JiraIssueMetadata, IssueType, CreateIssueInput, CreateIssueOutput } from './jira-issue-type.js';
import { JiraFixVersion } from './jira-fix-version.js';
import { JiraSprint } from './jira-sprint.js';
import { StandardTask } from './standard-task.js';
import { StandardProject } from './standard-project.js';
import { StandardTeam } from './standard-team.js';
import { StandardUser } from './standard-user.js';
import { StandardMilestone } from './standard-milestone.js';
import { StandardCycle } from './standard-cycle.js';
import { StandardComment } from './standard-comment.js';

export const models = {
    JiraProjectId,
    JiraIssueMetadata,
    Timestamps,
    Author,
    Comment,
    Issue,
    Project,
    IssueType,
    CreateIssueInput,
    CreateIssueOutput,
    JiraFixVersion,
    JiraSprint,
    StandardTask,
    StandardProject,
    StandardTeam,
    StandardUser,
    StandardMilestone,
    StandardCycle,
    StandardComment
};
