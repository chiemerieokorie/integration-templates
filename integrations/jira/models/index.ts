// Jira provider models
export * from './jira-issue.js';
export * from './jira-project.js';
export * from './jira-issue-type.js';
export * from './jira-fix-version.js';
export * from './jira-sprint.js';

// Standard unified models
export * from './standard-task.js';
export * from './standard-project.js';
export * from './standard-team.js';
export * from './standard-user.js';
export * from './standard-milestone.js';
export * from './standard-cycle.js';
export * from './standard-comment.js';

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
