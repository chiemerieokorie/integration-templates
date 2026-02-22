# Project Integration Unification

This document defines the unified project model used across project management integrations (Linear, Asana, Jira, GitHub). A "project" represents a container that groups tasks toward a shared goal, with optional timeline and ownership information.

Schema.org basis: [schema:Project](https://schema.org/Project) and [schema:CreativeWork](https://schema.org/CreativeWork).

## Standardized Project Model

```typescript
interface StandardProject {
    // Core fields
    id: string;
    name: string;               // schema:name
    description: string | null; // schema:description

    // State
    status: 'PLANNED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | null;

    // Timeline — schema:startDate / schema:endDate
    startDate: string | null;   // ISO date (YYYY-MM-DD)
    targetDate: string | null;  // ISO date — planned end/delivery date

    // Ownership
    ownerId: string | null;     // schema:author — lead or owner user ID
    teamId: string | null;      // which team/workspace this belongs to

    // Navigation
    url: string | null;         // schema:url — link to project in provider UI

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string;          // ISO datetime
    updatedAt: string;          // ISO datetime
}
```

### Field Notes

- **`status`**: Linear has the richest status model. Asana and GitHub only express active vs. archived. Jira has no project status concept.
- **`targetDate`**: Linear calls this `targetDate`; Asana uses `due_on`; Jira and GitHub repos don't expose a target date at the project level.
- **`ownerId`**: References a `StandardUser.id` from the same provider. Linear: project lead; Asana: project owner; Jira: project lead; GitHub: repository owner account ID.
- **`teamId`**: References a `StandardTeam.id`. Linear uses teams directly; Asana uses workspace GID; GitHub uses organization ID.
- **`url`**: May be `null` for GitHub repos when the repo is private and the URL requires auth context.

---

## Provider Field Mapping

| StandardProject | Linear | Asana | Jira | GitHub (Repo) |
|---|---|---|---|---|
| `id` | `id` | `gid` | `id` | `"${owner}/${name}"` |
| `name` | `name` | `name` | `name` | `name` |
| `description` | `description` | `notes` | `description` | `description` |
| `status` | `state` (see mapping) | `archived` (see mapping) | `null` | `archived` (see mapping) |
| `startDate` | `startDate` | `start_on` | `null` | `null` |
| `targetDate` | `targetDate` | `due_on` | `null` | `null` |
| `ownerId` | `lead.id` | `owner.gid` | `lead.accountId` | `owner.id` |
| `teamId` | `team.id` | `workspace.gid` | `null` | `organization.id` |
| `url` | `url` | `permalink_url` | constructed from `key` | `html_url` |
| `createdAt` | `createdAt` | `created_at` | `null` | `created_at` |
| `updatedAt` | `updatedAt` | `modified_at` | `null` | `updated_at` |

---

## Status Mapping

### Linear
Linear uses an explicit `state` enum on projects:

| Linear `state` | StandardProject `status` |
|---|---|
| `planned` | `PLANNED` |
| `started` | `ACTIVE` |
| `paused` | `PAUSED` |
| `completed` | `COMPLETED` |
| `cancelled` | `CANCELLED` |

### Asana
Asana expresses project state through the `archived` boolean and the `current_status` object:

| Asana value | StandardProject `status` |
|---|---|
| `archived: true` | `COMPLETED` |
| `current_status.color: "red"` | `PAUSED` |
| `archived: false` (otherwise) | `ACTIVE` |

`PLANNED` and `CANCELLED` have no Asana equivalent at the project level.

### Jira
Jira has no project-level status — projects are always active containers. Map to `null`.

### GitHub
GitHub repositories use an `archived` boolean:

| GitHub value | StandardProject `status` |
|---|---|
| `archived: true` | `COMPLETED` |
| `archived: false` | `ACTIVE` |

`PLANNED`, `PAUSED`, and `CANCELLED` are not supported.

---

## Example Unified Outputs

### Linear Example

```typescript
{
    id: "proj_abc123",
    name: "Mobile App Redesign",
    description: "Complete redesign of the iOS and Android apps for Q2 launch",
    status: "ACTIVE",
    startDate: "2026-01-01",
    targetDate: "2026-03-31",
    ownerId: "user_lead123",
    teamId: "team_mobile",
    url: "https://linear.app/myorg/project/mobile-app-redesign-abc123",
    providerSpecific: {
        slugId: "mobile-app-redesign",
        color: "#4CAF50",
        progress: 42,
        icon: "📱"
    },
    createdAt: "2025-12-01T10:00:00.000Z",
    updatedAt: "2026-02-10T14:30:00.000Z"
}
```

### Asana Example

```typescript
{
    id: "1234567890123456",
    name: "Website Launch",
    description: "All tasks related to the Q1 website relaunch",
    status: "ACTIVE",
    startDate: "2026-01-15",
    targetDate: "2026-03-15",
    ownerId: "9876543210987654",
    teamId: "1111111111111111",
    url: "https://app.asana.com/0/1234567890123456",
    providerSpecific: {
        color: "light-green",
        isTemplate: false,
        currentStatusColor: "green"
    },
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-02-01T11:00:00.000Z"
}
```

### Jira Example

```typescript
{
    id: "10001",
    name: "Infrastructure",
    description: null,
    status: null,
    startDate: null,
    targetDate: null,
    ownerId: "5b10ac8d82e05b22cc7d4ef5",
    teamId: null,
    url: "https://mycompany.atlassian.net/projects/INFRA",
    providerSpecific: {
        key: "INFRA",
        projectTypeKey: "software",
        simplified: false,
        avatarUrl: "https://mycompany.atlassian.net/rest/api/2/universal_avatar/..."
    },
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z"
}
```

### GitHub Example

```typescript
{
    id: "acme/backend",
    name: "backend",
    description: "Core backend API service",
    status: "ACTIVE",
    startDate: null,
    targetDate: null,
    ownerId: "1234567",
    teamId: "9876543",
    url: "https://github.com/acme/backend",
    providerSpecific: {
        owner: "acme",
        repo: "backend",
        fullName: "acme/backend",
        isPrivate: false,
        defaultBranch: "main",
        language: "TypeScript",
        stargazersCount: 42
    },
    createdAt: "2023-03-10T12:00:00.000Z",
    updatedAt: "2026-02-18T09:00:00.000Z"
}
```
