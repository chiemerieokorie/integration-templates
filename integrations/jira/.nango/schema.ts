export interface StandardTask {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  assigneeId: string;
  creatorId: string;
  projectId: string;
  labels: string[];
  dueDate: string;
  url: string;
  providerSpecific: {};
  createdAt: string;
  updatedAt: string;
};

export interface Issue {
  id: string;
  createdAt: string;
  updatedAt: string;
  key: string;
  summary: string;
  issueType: string;
  status: string;
  assignee: string | null;
  url: string;
  webUrl: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  comments: ({  id: string;
  createdAt: string;
  updatedAt: string;
  author: {  accountId: string | null;
  active: boolean;
  displayName: string;
  emailAddress: string | null;};
  body: {};})[];
};

export interface SyncMetadata_jira_issuetypes {
  projectIdsToSync: ({  id: string;})[];
  cloudId?: string | undefined;
  baseUrl?: string | undefined;
  timeZone?: string | undefined;
};

export interface IssueType {
  projectId: string;
  id: string;
  name: string;
  description: string | null;
  url: string;
};

export interface SyncMetadata_jira_issues {
  projectIdsToSync: ({  id: string;})[];
  cloudId?: string | undefined;
  baseUrl?: string | undefined;
  timeZone?: string | undefined;
};

export interface SyncMetadata_jira_projects {
  projectIdsToSync: ({  id: string;})[];
  cloudId?: string | undefined;
  baseUrl?: string | undefined;
  timeZone?: string | undefined;
};

export interface Project {
  id: string;
  key: string;
  name: string;
  url: string;
  projectTypeKey: string;
  webUrl: string;
};

export interface SyncMetadata_jira_unifiedtasks {
  projectIdsToSync: ({  id: string;})[];
  cloudId?: string | undefined;
  baseUrl?: string | undefined;
  timeZone?: string | undefined;
};

export interface ActionInput_jira_createissue {
  summary: string;
  description?: string | undefined;
  assignee?: string | undefined;
  labels?: string[] | undefined;
  project: string;
  issueType: string;
};

export interface ActionOutput_jira_createissue {
  id: string;
  key: string;
  self: string;
};
