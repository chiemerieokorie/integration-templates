# Team Integration Unification

This document defines the unified team model used across project management integrations (Linear, Asana, Jira, GitHub). A "team" is the top-level organizational container — the group that owns projects and tasks. Different providers use different names: Linear calls them **teams**, Asana calls them **workspaces**, Jira implicitly groups work under an **organization/site**, and GitHub uses **organizations**.

## Standardized Team Model

```typescript
interface StandardTeam {
    // Core fields
    id: string;
    name: string;               // schema:name
    description: string | null; // schema:description

    // Navigation
    url: string | null;         // schema:url — link to the team/workspace in provider UI

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string;          // ISO datetime
    updatedAt: string;          // ISO datetime
}
```

### Field Notes

- **`description`**: Not all providers expose a team-level description. Linear teams have an optional description; Asana workspaces do not; GitHub organizations have a `description` field; Jira has no equivalent.
- **`url`**: Linear teams don't have a standalone URL separate from the org. Asana workspaces have a permalink. GitHub organization URLs are predictable (`https://github.com/<org>`).
- **`createdAt` / `updatedAt`**: Linear and Asana expose these. GitHub organizations expose `created_at`. Jira does not expose org-level timestamps in their standard REST API.
- **Jira**: Jira Cloud is scoped to a "site" (e.g., `mycompany.atlassian.net`). There is no `/organization` REST endpoint — the site identity comes from the OAuth token's `cloudId`. Map the `cloudId` and `baseUrl` to `StandardTeam`.

---

## Provider Field Mapping

| StandardTeam | Linear | Asana | Jira | GitHub (Org) |
|---|---|---|---|---|
| `id` | `id` | `gid` | `cloudId` | `id` (numeric → string) |
| `name` | `name` | `name` | site hostname | `login` |
| `description` | `description` | `null` | `null` | `description` |
| `url` | `null` | `null` | `baseUrl` | `html_url` |
| `createdAt` | `createdAt` | `null` | `null` | `created_at` |
| `updatedAt` | `updatedAt` | `null` | `null` | `updated_at` |

---

## Concept Mapping

| Concept | Linear | Asana | Jira | GitHub |
|---|---|---|---|---|
| Team/Org unit | Team | Workspace / Organization | Site (cloudId) | Organization |
| Sub-group | (none — projects are direct children of teams) | Team (within workspace) | Project category | Team (within org) |
| Identifier | UUID | GID | cloudId + baseUrl | numeric org ID |
| URL pattern | n/a | n/a | `https://<site>.atlassian.net` | `https://github.com/<org>` |

### Asana: Workspace vs. Organization

Asana distinguishes between a **workspace** (a personal or small-team account) and an **organization** (a company account with domain-based membership). Both are represented in `AsanaWorkspace.is_organization`. Map both to `StandardTeam`; put `is_organization` in `providerSpecific`.

### Jira: No Explicit Team Sync

Jira's accessible resources endpoint (`/oauth/token/accessible-resources`) returns site-level objects. There is no paginated "list teams" endpoint. `StandardTeam` for Jira should be created once per connection from the OAuth metadata rather than via a recurring sync.

---

## Example Unified Outputs

### Linear Example

```typescript
{
    id: "team_abc123",
    name: "Mobile",
    description: "iOS and Android product team",
    url: null,
    providerSpecific: {
        key: "MOB",
        timezone: "America/New_York",
        cyclesEnabled: true,
        issueCount: 248
    },
    createdAt: "2023-01-15T10:00:00.000Z",
    updatedAt: "2026-01-20T08:00:00.000Z"
}
```

### Asana Example

```typescript
{
    id: "1234567890123456",
    name: "Acme Corp",
    description: null,
    url: null,
    providerSpecific: {
        isOrganization: true,
        emailDomains: ["acmecorp.com"]
    },
    createdAt: null,
    updatedAt: null
}
```

### Jira Example

```typescript
{
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "mycompany.atlassian.net",
    description: null,
    url: "https://mycompany.atlassian.net",
    providerSpecific: {
        cloudId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        scopes: ["read:jira-work", "write:jira-work"]
    },
    createdAt: null,
    updatedAt: null
}
```

### GitHub Example

```typescript
{
    id: "9876543",
    name: "acme",
    description: "Acme Corporation open source and internal tools",
    url: "https://github.com/acme",
    providerSpecific: {
        login: "acme",
        avatarUrl: "https://avatars.githubusercontent.com/u/9876543",
        type: "Organization",
        publicRepos: 12,
        totalPrivateRepos: 34
    },
    createdAt: "2019-06-01T12:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z"
}
```
