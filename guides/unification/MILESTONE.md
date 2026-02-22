# Milestone Integration Unification

This document defines the unified milestone model across project management integrations (Linear, Asana, Jira, GitHub). A "milestone" is a named checkpoint or goal within a project — it groups tasks and has a target completion date, but unlike a cycle/sprint it is not time-boxed or recurring. Think of it as "ship this version" or "complete this phase".

Related concept: [CYCLE.md](./CYCLE.md) covers time-boxed recurring iterations (sprints/cycles), which are distinct.

## Standardized Milestone Model

```typescript
interface StandardMilestone {
    // Core fields
    id: string;
    name: string;                 // schema:name
    description: string | null;   // schema:description

    // State
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | null;

    // Relationships
    projectId: string | null;     // which project this milestone belongs to

    // Timeline — schema:startDate / schema:endDate
    startDate: string | null;     // ISO date — when work toward this milestone begins
    targetDate: string | null;    // ISO date — planned completion date (schema:endDate)
    completedAt: string | null;   // ISO datetime — when it was actually closed/released

    // Progress
    progress: number | null;      // 0–100 (percentage of associated tasks completed)

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string;            // ISO datetime
    updatedAt: string;            // ISO datetime
}
```

### Field Notes

- **`status`**: Linear has an explicit status enum. GitHub milestones use `open` / `closed`. Jira fix versions use `released: boolean` plus an optional `releaseDate`. Asana does not have a native milestone entity at the project level (milestones are modeled as tasks with `resource_subtype: "milestone"`).
- **`projectId`**: References a `StandardProject.id`. Linear milestones belong to a specific project. GitHub milestones belong to a repository. Jira fix versions belong to a project. Asana milestone-tasks belong to a project.
- **`targetDate`**: Linear calls this `targetDate`; GitHub uses `due_on`; Jira uses `releaseDate`. Always an ISO date string (date only, no time component).
- **`completedAt`**: Only GitHub exposes a `closed_at` timestamp when a milestone is closed. Jira's `releaseDate` can approximate this when `released: true`. Linear and Asana do not expose a completion timestamp.
- **`progress`**: Linear computes a `progress` float (0–1) for project milestones — multiply by 100. GitHub exposes `open_issues` and `closed_issues` counts — compute as `closedIssues / (openIssues + closedIssues) * 100`. Jira does not provide this natively.

---

## Provider Concept Mapping

| Concept | Linear | Asana | Jira | GitHub |
|---|---|---|---|---|
| Milestone entity | Project Milestone (`ProjectMilestone`) | Milestone task (`resource_subtype: "milestone"`) | Fix Version (`Version`) | Repository Milestone |
| Lives inside | Project | Project | Project | Repository |
| Has target date | ✅ `targetDate` | ✅ `due_on` on the task | ✅ `releaseDate` | ✅ `due_on` |
| Has status | ✅ enum | ✅ `completed` boolean | ✅ `released` boolean | ✅ `open`/`closed` |
| Has progress % | ✅ float | computed from subtasks | ❌ | ✅ open/closed issue counts |

---

## Provider Field Mapping

| StandardMilestone | Linear | Asana (milestone task) | Jira (Fix Version) | GitHub (Milestone) |
|---|---|---|---|---|
| `id` | `id` | `gid` | `id` | `id` (numeric → string) |
| `name` | `name` | `name` | `name` | `title` |
| `description` | `description` | `notes` | `description` | `description` |
| `status` | `status` (see mapping) | `completed` (see mapping) | `released` (see mapping) | `state` (see mapping) |
| `projectId` | `project.id` | project GID (from context) | project `id` | `"${owner}/${repo}"` |
| `startDate` | `null` | `start_on` | `startDate` | `null` |
| `targetDate` | `targetDate` | `due_on` | `releaseDate` | `due_on` |
| `completedAt` | `null` | `completed_at` | `releaseDate` (if released) | `closed_at` |
| `progress` | `progress * 100` | computed | `null` | `closedIssues / total * 100` |
| `createdAt` | `createdAt` | `created_at` | `null` | `created_at` |
| `updatedAt` | `updatedAt` | `modified_at` | `null` | `updated_at` |

---

## Status Mapping

### Linear

| Linear milestone `status` | StandardMilestone `status` |
|---|---|
| `planned` | `PLANNED` |
| `active` | `ACTIVE` |
| `completed` | `COMPLETED` |
| `cancelled` | `CANCELLED` |

### Asana (milestone tasks)

| Asana `completed` | StandardMilestone `status` |
|---|---|
| `false` (and past due) | `PLANNED` |
| `false` (and not past due) | `PLANNED` |
| `true` | `COMPLETED` |

Asana has no `ACTIVE` or `CANCELLED` concept for milestones.

### Jira (Fix Versions)

| Jira `released` | StandardMilestone `status` |
|---|---|
| `false`, `releaseDate` in future | `PLANNED` |
| `false`, `releaseDate` in past | `ACTIVE` |
| `true` | `COMPLETED` |
| `archived: true` | `CANCELLED` |

### GitHub

| GitHub milestone `state` | StandardMilestone `status` |
|---|---|
| `open` | `ACTIVE` |
| `closed` | `COMPLETED` |

GitHub has no `PLANNED` or `CANCELLED` distinction.

---

## Example Unified Outputs

### Linear Example

```typescript
{
    id: "milestone_abc123",
    name: "v2.0 Launch",
    description: "All features required for the 2.0 public release",
    status: "ACTIVE",
    projectId: "proj_mobile",
    startDate: null,
    targetDate: "2026-03-31",
    completedAt: null,
    progress: 67,
    providerSpecific: {
        sortOrder: 1
    },
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-02-15T09:00:00.000Z"
}
```

### Jira Example (Fix Version)

```typescript
{
    id: "10023",
    name: "3.4.1",
    description: "Patch release with security fixes",
    status: "PLANNED",
    projectId: "10001",
    startDate: "2026-02-01",
    targetDate: "2026-03-15",
    completedAt: null,
    progress: null,
    providerSpecific: {
        self: "https://mycompany.atlassian.net/rest/api/2/version/10023",
        archived: false,
        released: false,
        userStartDate: "01/Feb/2026",
        userReleaseDate: "15/Mar/2026"
    },
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z"
}
```

### GitHub Example

```typescript
{
    id: "987654",
    name: "v1.5.0",
    description: "Add support for OAuth2 and rate limiting",
    status: "ACTIVE",
    projectId: "acme/backend",
    startDate: null,
    targetDate: "2026-04-01",
    completedAt: null,
    progress: 45,
    providerSpecific: {
        number: 7,
        openIssues: 11,
        closedIssues: 9,
        htmlUrl: "https://github.com/acme/backend/milestone/7"
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-02-10T08:00:00.000Z"
}
```
