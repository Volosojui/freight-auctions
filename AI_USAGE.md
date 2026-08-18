# AI Usage

> This is my account of how AI was used on this project. It reflects the actual
> process; adjust the wording to your voice if anything reads off.

## How AI was used

I built the project with an AI coding assistant (Claude Code) driving a
spec-driven workflow (OpenSpec). Each capability was a "change" with a proposal,
design, spec (WHEN/THEN scenarios) and a task list, implemented against acceptance
tests and archived once green. AI produced the bulk of:

- the OpenSpec artifacts (proposals, designs, specs, tasks) derived from the
  OpenAPI contract and the task brief;
- the Zod contract layer, the request builder, the endpoint functions and the
  stateful MSW mock (store, seed, handlers, mutation);
- the UI (list, detail with a bets tab, the bid form) following Feature-Sliced
  Design and the `*.component.tsx` naming convention;
- the tests: unit (pure logic), integration (jsdom + MSW), and Playwright e2e.

Two feature changes (`auctions-list` and `auction-detail`) were built in parallel
by two isolated agents on separate git worktrees, then merged; I reconciled the
shared surface (enum labels, formatters, the detail query key, FSD barrels) at
merge time.

## Decisions I made myself

- **Client-state library: MobX** (over Zustand) for pointwise UI state, with a
  firm rule that server state stays in TanStack Query and MobX never duplicates
  Query or router state.
- **Change granularity: 7 OpenSpec changes** (bootstrap → api/mocks → list →
  detail → bets → place-bet → docs), rather than fewer, larger changes, so each
  stays reviewable and independently verifiable.
- **Parallelization strategy:** run `auctions-list` and `auction-detail` as two
  isolated worktree agents against an agreed contract (shared query key, label
  location, append-only barrels) and merge, instead of building them sequentially
  or in one shared workspace.
- **Process policy:** English for code/comments/docs/commits (Russian kept for the
  product UI and domain data); and every change must ship acceptance tests — unit
  + integration, plus Playwright e2e for end-to-end paths — tied to its spec
  scenarios, with commits in Conventional-Commits style and no AI attribution.

## AI suggestions I rejected or corrected

- The initial design placed the Zod contract schemas in the `entities` layer with
  `shared/api` depending on them. That breaks FSD — the MSW mock lives in `shared`
  and `shared` cannot import "up". I had it corrected so the raw contract lives in
  `shared/api` and `entities` holds view-model mappers on top.
- The AI first added a `Co-Authored-By` trailer and mixed Russian into commit
  messages; I rejected both and had the history rewritten to English-only,
  attribution-free messages.
- The AI reported the trading-`status` filter as "done" while it was only in the
  schema/URL, with no store field or UI. I caught the gap and had it wired and
  tested so the full ТЗ minimum filter set is actually present.
- The AI initially gated MSW on `import.meta.env.DEV` to keep mocks out of the
  production bundle. Since the app has no real backend, that broke the Netlify
  deploy (`ERR_NAME_NOT_RESOLVED`). I had it changed to run MSW in every
  environment and added a Netlify SPA redirect.

## What I reviewed especially carefully

- **Contract fidelity:** enum handling (every enum has an `Unknown` fallback and
  unknown values coerce to it), nullable fields, and the error shapes
  (`ProblemDetail` vs the 422 `ValidationProblem` with `errors[]`).
- **DTO restriction flags** on the detail page: `hide_points_address_and_contacts`,
  `no_view_cargo_price`, `hide_bets_history`, `can_set_bet` — applied centrally in
  one gate mapper and asserted per flag.
- **The mock mutation** on a successful bid (current price, own-bid state, trading
  status, bets list) plus query invalidation — the observable end-to-end behavior
  the task asks for.
- **The merge** of the two parallel branches — verifying the union of
  labels/formatters kept both sides' tests passing rather than silently dropping
  one branch's assumptions.

## Remaining risks

- The mock ranks bids by lowest price; the real per-auction-type logic
  (Up/Down/Request/FixPrice) is not modelled, so the trading status after a bid is
  a simplification.
- Only the ТЗ minimum filter set is wired end-to-end; the full ~45-field
  `AuctionListRequest` is supported by the builder/schema but not exercised.
- `shared/api/mock/cities.ts` is imported by app UI, so the dictionary is bundled;
  it would be cleaner in a non-mock shared module.
- Contract schemas are hand-written from the OpenAPI file; drift from the source
  would only be caught by the mock's own contract tests.

## What I'd improve with another day

- Model per-auction-type ranking and richer trading-status transitions in the mock.
- Wire the full filter set (date ranges, price/weight/volume, status arrays) with
  tests for each field.
- Generate the Zod schemas from the OpenAPI file to eliminate drift, and move the
  city dictionary out of `shared/api/mock` into a proper shared config.
- Add optimistic updates and clear loading/disabled affordances during bid
  submission.
