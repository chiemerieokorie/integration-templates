# Cycle Integration Unification

This document defines the unified cycle model across project management integrations (Linear, Asana, Jira, GitHub). A "cycle" is a **time-boxed, recurring iteration** — the cadence unit teams use to plan and ship work. Linear calls them **cycles**, Jira calls them **sprints**. Asana and GitHub have no native equivalent.

Cycles are distinct from milestones (see [MILESTONE.md](./MILESTONE.md)): milestones are fixed checkpoints tied to goals, while cycles are repeating time boxes tied to a team's delivery rhythm.

Schema.org basis: [schema:Event](https://schema.org/Event) with a recurrence/sequence nature.

## Standardized Cycle Model

```typescript
interface StandardCycle {
    // Core fields
    id: string;
    name: string;                 // schema:name — e.g., "Sprint 14" or "Cycle 3"
    description: string | null;   // schema:description

    // Sequence
    number: number | null;        // ordinal position in the team's sequence of cycles

    // State
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

    // Relationships
    teamId: string | null;        // which team/board runs this cycle

    // Timeline — schema:startDate / schema:endDate
    startDate: string | null;     // ISO datetime — when the cycle/sprint started
    endDate: string | null;       // ISO datetime — when the cycle/sprint is scheduled to end
    completedAt: string | null;   // ISO datetime — actual close/complete timestamp

    // Progress
    progress: number | null;      // 0–100 (percentage of scoped tasks completed)

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string;            // ISO datetime
    updatedAt: string;            // ISO datetime
}
```

### Field Notes

- **`number`**: Linear uses an auto-incrementing `number` per team. Jira sprints have a numeric `id` that acts as a sequence, but it is global across the board rather than reset per project. Use the sprint `id` as `number` for Jira.
- **`status`**: Linear derives status from `startsAt` / `endsAt` / `completedAt`. Jira sprints have an explicit `state` field (`future` / `active` / `closed`).
- **`teamId`**: For Linear, this is the team ID. For Jira, sprints live on a **board** (`boardId`), which maps to a project — use the associated project's ID as `teamId`, or the board's `location.projectId`.
- **`startDate` / `endDate`**: Linear uses datetime strings (`startsAt` / `endsAt`). Jira sprint dates are ISO datetimes.
- **`completedAt`**: Linear stores `completedAt` when a cycle is manually completed. Jira sprints expose `completeDate` when closed.
- **`progress`**: Linear computes a float (`completedScopeHistory`). For Jira, derive from sprint report data if available, otherwise `null`.
- **Asana / GitHub**: Neither has a cycle or sprint concept. When implementing `StandardCycle` syncs for these providers, return an empty result set.

---

## Provider Concept Mapping

| Concept | Linear | Jira | Asana | GitHub |
|---|---|---|---|---|
| Cycle entity | Cycle | Sprint (Jira Software) | ❌ | ❌ |
| Scoped to | Team | Board (→ Project) | — | — |
| Recurrence | Manual (team creates per cycle) | Manual (via backlog/board) | — | — |
| Status model | Derived from dates + `completedAt` | Explicit `state` field | — | — |
| Active at once | One per team | Multiple boards can have one active | — | — |

---

## Provider Field Mapping

| StandardCycle | Linear (Cycle) | Jira (Sprint) |
|---|---|---|
| `id` | `id` | `id` (numeric → string) |
| `name` | `name` | `name` |
| `description` | `description` | `null` |
| `number` | `number` | `id` (sprint's numeric ID) |
| `status` | derived (see mapping) | `state` (see mapping) |
| `teamId` | `team.id` | `originBoardId` → project ID |
| `startDate` | `startsAt` | `startDate` |
| `endDate` | `endsAt` | `endDate` |
| `completedAt` | `completedAt` | `completeDate` |
| `progress` | `progress * 100` | `null` |
| `createdAt` | `createdAt` | `null` |
| `updatedAt` | `updatedAt` | `null` |

---

## Status Mapping

### Linear

Linear cycles have no explicit `status` field — derive it from the dates and completion marker:

| Condition | StandardCycle `status` |
|---|---|
| `completedAt` is set | `COMPLETED` |
| `startsAt` > now | `PLANNED` |
| `startsAt` ≤ now ≤ `endsAt` | `ACTIVE` |
| `endsAt` < now and no `completedAt` | `COMPLETED` (lapsed) |

### Jira

Jira sprint `state` maps directly:

| Jira `state` | StandardCycle `status` |
|---|---|
| `future` | `PLANNED` |
| `active` | `ACTIVE` |
| `closed` | `COMPLETED` |

`CANCELLED` is not a Jira sprint concept.

---

## Example Unified Outputs

### Linear Example

```typescript
{
    id: "cycle_abc123",
    name: "Cycle 14",
    description: null,
    number: 14,
    status: "ACTIVE",
    teamId: "team_mobile",
    startDate: "2026-02-17T00:00:00.000Z",
    endDate: "2026-03-02T00:00:00.000Z",
    completedAt: null,
    progress: 38,
    providerSpecific: {
        issueCountHistory: [0, 3, 8, 12, 15],
        completedScopeHistory: [0, 1, 2, 5, 8],
        scopeHistory: [0, 3, 8, 13, 15]
    },
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-21T08:30:00.000Z"
}
```

### Jira Example

```typescript
{
    id: "42",
    name: "Sprint 18 — Auth Hardening",
    description: null,
    number: 42,
    status: "ACTIVE",
    teamId: "10001",
    startDate: "2026-02-10T08:00:00.000Z",
    endDate: "2026-02-24T08:00:00.000Z",
    completedAt: null,
    progress: null,
    providerSpecific: {
        originBoardId: 7,
        goal: "Harden authentication flows before v3.0 release"
    },
    createdAt: null,
    updatedAt: null
}
```
