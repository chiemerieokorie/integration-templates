# Comment & Label Integration Unification

This document defines the unified models for two task-adjacent entities: **comments** (replies on a task) and **labels** (tags applied to tasks). Both are tightly coupled to `StandardTask` but modeled separately to allow independent syncing and richer metadata.

---

## StandardComment

A comment is a message posted by a user on a task/issue. All four providers support comments on issues/tasks, though not all are currently synced.

Schema.org basis: [schema:Comment](https://schema.org/Comment).

### Model

```typescript
interface StandardComment {
    // Core fields
    id: string;
    body: string;                 // schema:text — plain text or Markdown

    // Relationships
    taskId: string;               // schema:about — the StandardTask this comment belongs to
    authorId: string | null;      // schema:author — the StandardUser who wrote it
    parentId: string | null;      // schema:parentItem — for threaded/nested replies

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string;            // ISO datetime
    updatedAt: string;            // ISO datetime
}
```

#### Field Notes

- **`body`**: Store as plain text where possible. Jira uses the [Atlassian Document Format (ADF)](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/) — extract text nodes recursively for the `body` value, and store the raw ADF object in `providerSpecific.rawBody`.
- **`taskId`**: References `StandardTask.id` from the same provider.
- **`authorId`**: References `StandardUser.id`. May be `null` for automated/system comments (e.g., Jira automation rules).
- **`parentId`**: Linear supports threaded comments; set `parentId` for replies. Jira, Asana, and GitHub do not support threading — always `null`.

#### Provider Field Mapping

| StandardComment | Linear | Asana (Story) | Jira | GitHub |
|---|---|---|---|---|
| `id` | `id` | `gid` | `id` | `id` (numeric → string) |
| `body` | `body` (markdown) | `text` | extracted from ADF | `body` (markdown) |
| `taskId` | `issue.id` | `task.gid` | issue `id` | issue `id` |
| `authorId` | `user.id` | `created_by.gid` | `author.accountId` | `user.id` |
| `parentId` | `parent.id` | `null` | `null` | `null` |
| `createdAt` | `createdAt` | `created_at` | `created` | `created_at` |
| `updatedAt` | `updatedAt` | `null` | `updated` | `updated_at` |

#### Asana Stories

Asana's equivalent of comments is the **Story** (`resource_type: "story"`). Only stories with `type: "comment"` should be mapped to `StandardComment`. System-generated stories (`type: "system"`) should be ignored.

---

## StandardLabel

A label (or tag) is a categorical marker applied to tasks. All four providers support labels in some form, though the richness varies significantly.

Schema.org basis: [schema:DefinedTerm](https://schema.org/DefinedTerm) — a term defined within a particular context.

### Model

```typescript
interface StandardLabel {
    // Core fields
    id: string;
    name: string;                 // schema:name

    // Appearance
    color: string | null;         // hex code, e.g. "#FF5733" — schema:color
    description: string | null;   // schema:description

    // Scope
    teamId: string | null;        // which team/workspace owns this label

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string | null;     // ISO datetime
    updatedAt: string | null;     // ISO datetime
}
```

#### Field Notes

- **`color`**: Linear stores a hex color string. GitHub stores a hex color **without** the `#` prefix — normalize by prepending `#`. Asana tags have a named color (e.g., `"dark-pink"`) rather than a hex value — store the raw name in `providerSpecific.colorName` and set `color: null` unless a lookup table is maintained.
- **`description`**: GitHub labels have a `description` field. Linear and Asana do not. Jira labels are plain strings with no metadata.
- **`teamId`**: Linear labels are scoped to a team. Asana tags are scoped to a workspace. GitHub labels are scoped to a repository (use `owner/repo` as `teamId`). Jira labels are global strings with no ownership.
- **`id`**: Jira labels are plain strings, not objects with IDs. There is no label entity to sync — they exist only as `string[]` on issues. For Jira, `StandardLabel` cannot be populated independently and `StandardTask.labels` remains the only representation.

#### Provider Field Mapping

| StandardLabel | Linear | Asana (Tag) | Jira | GitHub |
|---|---|---|---|---|
| `id` | `id` | `gid` | ❌ (no entity) | `id` (numeric → string) |
| `name` | `name` | `name` | string value only | `name` |
| `color` | `color` (hex) | `null` | `null` | `"#" + color` |
| `description` | `null` | `null` | `null` | `description` |
| `teamId` | `team.id` | `workspace.gid` | `null` | `"${owner}/${repo}"` |
| `createdAt` | `createdAt` | `created_at` | `null` | `null` |
| `updatedAt` | `updatedAt` | `null` | `null` | `null` |

#### Relationship to StandardTask

`StandardTask.labels` is currently a `string[]` of label names. This is intentional for simplicity — consumers who only need label names don't have to join two records. When the full `StandardLabel` model is synced, `StandardTask.labels` can be cross-referenced by matching `StandardLabel.name` within the same provider.

A future `StandardTask.labelIds: string[]` field could be introduced for providers that support labels as first-class objects (Linear, Asana tags, GitHub) while keeping `labels: string[]` for Jira. That change would belong in [TASK.md](./TASK.md).

---

## Example Outputs

### StandardComment Examples

#### Jira Example

```typescript
{
    id: "10123",
    body: "This is blocked by the auth service being down. Pinging infra team.",
    taskId: "10042",
    authorId: "5b10ac8d82e05b22cc7d4ef5",
    parentId: null,
    providerSpecific: {
        rawBody: { version: 1, type: "doc", content: [...] },
        jsdPublic: true
    },
    createdAt: "2026-02-10T14:30:00.000Z",
    updatedAt: "2026-02-10T14:30:00.000Z"
}
```

#### GitHub Example

```typescript
{
    id: "1987654321",
    body: "Confirmed this reproduces on v1.4.2 but not v1.3.9. Bisect in progress.",
    taskId: "2123456789",
    authorId: "1234567",
    parentId: null,
    providerSpecific: {
        htmlUrl: "https://github.com/acme/backend/issues/42#issuecomment-1987654321",
        authorAssociation: "CONTRIBUTOR"
    },
    createdAt: "2026-02-12T09:15:00.000Z",
    updatedAt: "2026-02-12T09:15:00.000Z"
}
```

### StandardLabel Examples

#### Linear Example

```typescript
{
    id: "label_abc123",
    name: "bug",
    color: "#EB5757",
    description: null,
    teamId: "team_mobile",
    providerSpecific: {},
    createdAt: "2023-01-20T10:00:00.000Z",
    updatedAt: "2023-01-20T10:00:00.000Z"
}
```

#### GitHub Example

```typescript
{
    id: "987654321",
    name: "enhancement",
    color: "#84b6eb",
    description: "New feature or request",
    teamId: "acme/backend",
    providerSpecific: {
        defaultLabel: true,
        nodeId: "LA_kwDOAbc123"
    },
    createdAt: null,
    updatedAt: null
}
```
