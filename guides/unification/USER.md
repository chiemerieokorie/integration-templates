# User Integration Unification

This document defines the unified user/member model across project management integrations (Linear, Asana, Jira, GitHub). A "user" is any person who can be assigned tasks, mentioned in comments, or listed as a team member.

Schema.org basis: [schema:Person](https://schema.org/Person).

## Standardized User Model

```typescript
interface StandardUser {
    // Core identity
    id: string;
    displayName: string;          // schema:name — always populated; login/handle if no real name
    firstName: string | null;     // schema:givenName
    lastName: string | null;      // schema:familyName

    // Contact
    email: string | null;         // schema:email

    // Avatar
    avatarUrl: string | null;     // schema:image

    // Status
    isActive: boolean | null;     // schema:Boolean — false for deactivated/suspended accounts

    // Provider-specific data
    providerSpecific: Record<string, any>;

    // Audit fields — schema:dateCreated / schema:dateModified
    createdAt: string | null;     // ISO datetime — not all providers expose this
    updatedAt: string | null;     // ISO datetime — not all providers expose this
}
```

### Field Notes

- **`displayName`**: Always present. For GitHub, this is the `login` (username) since real names are not always public. For Jira, it is `displayName`. For Linear, it is `name` (or `firstName + lastName` if the full name field is absent). For Asana, it is `name`.
- **`firstName` / `lastName`**: Linear explicitly provides these. For Asana and Jira, split `name` / `displayName` on the first space as a best-effort heuristic. For GitHub, these are never reliably available via the API and should be `null`.
- **`email`**: Linear and Asana always return email. Jira returns `emailAddress` only when the viewer has permission to see it (bot/service accounts may omit it). GitHub does not return email through the standard Issues/Users API used in syncs.
- **`avatarUrl`**: All four providers expose some form of avatar. Asana returns multiple resolution variants in `photo`; use `image_128x128`. Jira returns `avatarUrls['48x48']`. GitHub avatar URLs follow the pattern `https://avatars.githubusercontent.com/u/<id>`.
- **`isActive`**: Jira exposes `active: boolean` directly. Linear has no `active` field but deactivated users stop appearing in responses. Asana and GitHub do not expose activation state in the standard fields available to syncs.
- **`createdAt` / `updatedAt`**: Linear exposes these. The other providers do not in their user list endpoints.

---

## Provider Field Mapping

| StandardUser | Linear | Asana | Jira | GitHub |
|---|---|---|---|---|
| `id` | `id` | `gid` | `accountId` | `id` (numeric → string) |
| `displayName` | `name` | `name` | `displayName` | `login` |
| `firstName` | `firstName` | split from `name` | split from `displayName` | `null` |
| `lastName` | `lastName` | split from `name` | split from `displayName` | `null` |
| `email` | `email` | `email` | `emailAddress` (optional) | `null` |
| `avatarUrl` | `avatarUrl` | `photo.image_128x128` | `avatarUrls['48x48']` | `https://avatars.githubusercontent.com/u/<id>` |
| `isActive` | `null` | `null` | `active` | `null` |
| `createdAt` | `createdAt` | `null` | `null` | `null` |
| `updatedAt` | `updatedAt` | `null` | `null` | `null` |

---

## Name Splitting Heuristic

For Asana and Jira where only a single `name` / `displayName` field exists, split on the **first space**:

```typescript
function splitName(fullName: string): { firstName: string; lastName: string | null } {
    const idx = fullName.indexOf(' ');
    if (idx === -1) return { firstName: fullName, lastName: null };
    return {
        firstName: fullName.slice(0, idx),
        lastName: fullName.slice(idx + 1)
    };
}
```

This is a best-effort approach and will not be correct for all cultures or naming conventions. If precision matters, store the original value in `providerSpecific.fullName`.

---

## Example Unified Outputs

### Linear Example

```typescript
{
    id: "user_abc123",
    displayName: "Alex Johnson",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@acmecorp.com",
    avatarUrl: "https://avatars.linear.app/abc123/photo.jpg",
    isActive: null,
    providerSpecific: {
        admin: false
    },
    createdAt: "2023-04-10T08:00:00.000Z",
    updatedAt: "2026-01-05T11:00:00.000Z"
}
```

### Asana Example

```typescript
{
    id: "9876543210987654",
    displayName: "Jordan Lee",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan@acmecorp.com",
    avatarUrl: "https://s3.amazonaws.com/profile_photos/acme/jordan_128x128.jpg",
    isActive: null,
    providerSpecific: {
        workspaceGid: "1111111111111111"
    },
    createdAt: null,
    updatedAt: null
}
```

### Jira Example

```typescript
{
    id: "5b10ac8d82e05b22cc7d4ef5",
    displayName: "Sam Rivera",
    firstName: "Sam",
    lastName: "Rivera",
    email: "sam@acmecorp.com",
    avatarUrl: "https://secure.gravatar.com/avatar/abc123?d=https%3A%2F%2Favatar-management.services.atlassian.com%2F...",
    isActive: true,
    providerSpecific: {
        accountType: "atlassian",
        timeZone: "America/Chicago"
    },
    createdAt: null,
    updatedAt: null
}
```

### GitHub Example

```typescript
{
    id: "1234567",
    displayName: "mrivera",
    firstName: null,
    lastName: null,
    email: null,
    avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
    isActive: null,
    providerSpecific: {
        login: "mrivera",
        type: "User",
        siteAdmin: false
    },
    createdAt: null,
    updatedAt: null
}
```
