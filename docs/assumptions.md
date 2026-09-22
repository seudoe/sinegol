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

## shadcn/ui CLI

The installed `shadcn` CLI version uses a `--base` (component library:
`radix` | `base` | `aria`) + `--preset` model instead of the older
`--base-color` flag. Initialized with `-d` (defaults: template `next`,
preset `base-nova`), base color `neutral`.
