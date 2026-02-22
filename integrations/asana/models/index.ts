export * from './asana-action-models.js';
export * from './asana-project.js';
export * from './asana-tag.js';
export * from './asana-task.js';
export * from './asana-user.js';
export * from './asana-workspace.js';
export * from './standard-label.js';
export * from './standard-project.js';
export * from './standard-task.js';
export * from './standard-team.js';
export * from './standard-user.js';

import {
    Id,
    Timestamps,
    NangoActionError,
    BaseAsanaModel,
    Limit,
    User,
    Task,
    AsanaProjectInput,
    CreateAsanaTask,
    AsanaUpdateTask,
    Anonymous_asana_action_fetchworkspaces_output,
    Anonymous_asana_action_fetchprojects_output,
    Anonymous_asana_action_deletetask_output
} from './asana-action-models.js';
import { AsanaProject } from './asana-project.js';
import { AsanaTag } from './asana-tag.js';
import { AsanaTask } from './asana-task.js';
import { AsanaPhoto, AsanaUser } from './asana-user.js';
import { AsanaWorkspace } from './asana-workspace.js';
import { StandardLabel } from './standard-label.js';
import { StandardProject } from './standard-project.js';
import { StandardTask } from './standard-task.js';
import { StandardTeam } from './standard-team.js';
import { StandardUser } from './standard-user.js';

export const models = {
    Id,
    Timestamps,
    NangoActionError,
    BaseAsanaModel,
    Limit,
    User,
    Task,
    AsanaProjectInput,
    CreateAsanaTask,
    AsanaPhoto,
    AsanaUser,
    AsanaTask,
    AsanaUpdateTask,
    AsanaWorkspace,
    AsanaProject,
    AsanaTag,
    Anonymous_asana_action_fetchworkspaces_output,
    Anonymous_asana_action_fetchprojects_output,
    Anonymous_asana_action_deletetask_output,
    StandardTask,
    StandardProject,
    StandardTeam,
    StandardUser,
    StandardLabel
};
