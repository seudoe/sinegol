# Assumptions

## Score-to-draw-number mapping (PRD ambiguity)

The PRD requires five golf scores per user and a 3/4/5-number match against a
monthly draw, but does not define how a "number" maps to a golf score.

**Chosen interpretation:** a user's raw score value (1-45) *is* their number
for that submission. A user's "ticket" for a given month is the set of
distinct values among their most recent (up to) 5 scores. The monthly draw
also produces 5 numbers in the same 1-45 range. A user's match count is the
size of the intersection between their ticket and the draw's numbers; 3, 4,
or 5 overlapping values earns the corresponding prize tier. This keeps a
single 1-45 domain shared by scores, tickets, and draws, matching §8's
requirement to use one interpretation consistently across the DB, draw
engine, UI, and tests.

Applied in:

- Database: `golf_scores.score` and `draws.numbers` both use the 1-45 range.
- Draw engine: `lib/draw/matcher.ts` intersects a user's distinct score
  values against `draws.numbers`.
- Types: `types/draw.ts` (`Draw.numbers: number[]`), `types/score.ts`.
- Tests (Stage 6+): will assert against this same mapping.

## `middleware.ts` -> `proxy.ts`

This project pins a Next.js version where the `middleware.js` file
convention is deprecated and renamed to `proxy.js` (Proxy defaults to the
Node.js runtime). Session refresh + route protection therefore live in
`proxy.ts` at the project root (delegating to `lib/supabase/proxy.ts`)
instead of the `middleware.ts` named in the original folder-structure sketch.
Behavior is unchanged; only the file/export name differs.

## Preview-mode auth bypass (only when Supabase env vars are unset)

`lib/auth/session.ts`'s `requireUser`/`requireAdmin` normally resolve the
profile from the Supabase session only, per §12 ("never trust `[username]`
in the URL for authorization"). If `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, there is no backend to
authenticate against, so these functions fall back to a demo profile built
from the route's `[username]` segment instead of redirecting to `/login`.
This exists purely so the dashboard UI can be reviewed without a Supabase
project. As soon as those two vars are set (see below), this bypass is
inert: `requireUser`/`requireAdmin` take the real session-only path, login
and signup (`components/domain/login-form.tsx`, `signup-form.tsx`) call
`supabase.auth.signInWithPassword` / `signUp`, and `[username]` in the URL
is never trusted for authorization, matching §12.

## Supabase's newer API key names vs. `@supabase/ssr`'s expected env vars

New Supabase projects' dashboard now names the Data API keys
`SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` (the
"publishable"/"secret" key system replacing the old "anon"/"service_role"
naming). `@supabase/ssr` and this app's `lib/supabase/*` still read the
Next.js convention (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) — client-exposed vars must be
`NEXT_PUBLIC_`-prefixed for Next.js to bundle them into the browser. `.env`
therefore carries both sets: the original Supabase-dashboard names, plus
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` (mirroring
`SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` — safe to expose) and
`SUPABASE_SERVICE_ROLE_KEY` (mirroring `SUPABASE_SECRET_KEY` — server-only,
never prefix this one with `NEXT_PUBLIC_`). `.env.local.example` documents
this.

## Hand-inserting `auth.users` via SQL is broken — use the Admin API

The first version of `supabase/fill-demo.sql` inserted demo rows directly
into `auth.users` with raw SQL (`crypt(...)`/`gen_salt('bf')`). This is
**not supported** and broke sign-in: GoTrue (Supabase Auth) also expects a
matching row in `auth.identities` per user, plus internal bookkeeping that a
raw `INSERT` doesn't produce. Confirmed against the live project: signing in
as one of these hand-inserted users returned `500 Database error querying
schema`, and once several such rows existed, even the Admin API's own
list/get-user endpoints started 500ing for *every* user.

Fix: `supabase/seed-demo-users.mjs` provisions the three demo accounts
through the Supabase Admin API (`POST /auth/v1/admin/users`) instead, which
correctly creates the `auth.identities` row too — confirmed this produces a
user that can actually sign in. `fill-demo.sql` no longer touches
`auth.users`; run the script first, then the SQL file.

**Action needed on the live project:** the three broken rows from the old
SQL script are still there and are actively breaking the Admin API's
user-listing/lookup endpoints. Delete them from the Supabase SQL editor
(cascades to their `profiles` rows):

```sql
delete from auth.users where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);
```

Then run `node supabase/seed-demo-users.mjs` followed by
`supabase/fill-demo.sql` again.

## No RLS policies yet (flagged, not fixed)

Per instruction, `supabase/create-all.sql` creates tables only — no RLS
policies. Since Postgres tables with RLS disabled are fully readable and
writable through PostgREST via the anon/publishable key, every table
(including `profiles`, `golf_scores`, etc.) is currently world-readable and
world-writable by anyone with the publishable key, which is bundled into
the browser. This is fine for local development but must be closed with
RLS policies before this project is ever pointed at real user data.

## shadcn/ui CLI

The installed `shadcn` CLI version uses a `--base` (component library:
`radix` | `base` | `aria`) + `--preset` model instead of the older
`--base-color` flag. Initialized with `-d` (defaults: template `next`,
preset `base-nova`), base color `neutral`.
