export { GithubIssue, Issue, GithubIssueRepoInput } from './github-issue.js';
export type { GithubIssue as GithubIssueType, Issue as IssueType, GithubIssueRepoInput as GithubIssueRepoInputType } from './github-issue.js';

export { GithubRepoFile } from './github-repo-file.js';
export type { GithubRepoFile as GithubRepoFileType } from './github-repo-file.js';

export { Repo, WriteFileInput, WriteFileOutput, GithubWriteFileActionResult, GithubWriteFileInput, GithubRepo } from './github-repo.js';
export type {
    Repo as RepoType,
    WriteFileInput as WriteFileInputType,
    WriteFileOutput as WriteFileOutputType,
    GithubWriteFileActionResult as GithubWriteFileActionResultType,
    GithubWriteFileInput as GithubWriteFileInputType,
    GithubRepo as GithubRepoType
} from './github-repo.js';

export { GithubMilestone } from './github-milestone.js';
export type { GithubMilestone as GithubMilestoneType } from './github-milestone.js';

export { GithubLabel } from './github-label.js';
export type { GithubLabel as GithubLabelType } from './github-label.js';

export { GithubUser } from './github-user.js';
export type { GithubUser as GithubUserType } from './github-user.js';

export * from './standard-task.js';
export * from './standard-project.js';
export * from './standard-user.js';
export * from './standard-milestone.js';
export * from './standard-label.js';

import { GithubIssue, Issue, GithubIssueRepoInput } from './github-issue.js';
import { GithubRepoFile } from './github-repo-file.js';
import { Repo, WriteFileInput, WriteFileOutput, GithubWriteFileActionResult, GithubWriteFileInput, GithubRepo } from './github-repo.js';
import { GithubMilestone } from './github-milestone.js';
import { GithubLabel } from './github-label.js';
import { GithubUser } from './github-user.js';
import { StandardTask } from './standard-task.js';
import { StandardProject } from './standard-project.js';
import { StandardUser } from './standard-user.js';
import { StandardMilestone } from './standard-milestone.js';
import { StandardLabel } from './standard-label.js';

export const models = {
    GithubIssue,
    Issue,
    GithubIssueRepoInput,
    GithubRepoFile,
    Repo,
    WriteFileInput,
    WriteFileOutput,
    GithubWriteFileActionResult,
    GithubWriteFileInput,
    GithubRepo,
    GithubMilestone,
    GithubLabel,
    GithubUser,
    StandardTask,
    StandardProject,
    StandardUser,
    StandardMilestone,
    StandardLabel
};
