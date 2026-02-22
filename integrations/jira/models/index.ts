// Jira provider models
export * from './jira-issue.js';
export * from './jira-project.js';
export * from './jira-issue-type.js';
export * from './jira-fix-version.js';
export * from './jira-sprint.js';

// Standard unified models
export * from '../../shared/models/index.js';

// Models registry
import { Timestamps, Author, Comment, Issue } from './jira-issue.js';
import { Project } from './jira-project.js';
import { JiraProjectId, JiraIssueMetadata, IssueType, CreateIssueInput, CreateIssueOutput } from './jira-issue-type.js';
import { JiraFixVersion } from './jira-fix-version.js';
import { JiraSprint } from './jira-sprint.js';
import { StandardTask, StandardProject, StandardTeam, StandardUser, StandardMilestone, StandardCycle, StandardComment } from '../../shared/models/index.js';

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
