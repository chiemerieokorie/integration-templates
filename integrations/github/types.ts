export interface GithubRepoRaw {
    owner: { login: string };
    name: string;
}

export interface GithubIssueRaw {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: string;
    html_url: string;
    user: { id: number; login: string } | null;
    assignee: { id: number; login: string } | null;
    labels: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
    pull_request?: unknown;
}

export interface GithubTeamRaw {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    html_url: string;
    organization: { id: number; login: string };
    created_at: string;
    updated_at: string;
}
