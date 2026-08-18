# AI Usage

> **Please review and personalize this file.** It is drafted from how the project
> was actually built, but it is your account of AI usage and your own judgment —
> adjust the wording and the "decided myself" / "reviewed carefully" sections to
> reflect your voice before submitting. Markers `TODO(you)` show where your input
> matters most.

## How AI was used

The project was built with an AI coding assistant (Claude Code) driving a
spec-driven workflow (OpenSpec). Each capability was a "change" with a proposal,
design, spec (WHEN/THEN scenarios) and a task list, implemented against acceptance
tests and archived once green. AI produced the bulk of:

- the OpenSpec artifacts (proposals, designs, specs, tasks) from the OpenAPI
  contract and the task brief;
- the Zod contract layer, the request builder, the endpoint functions and the
  stateful MSW mock (store, seed, handlers, mutation);
- the UI (list, detail with a bets tab, the bid form) following Feature-Sliced
  Design and the `*.component.tsx` naming convention;
- the tests: unit (pure logic), integration (jsdom + MSW), and Playwright e2e.

Two of the feature changes (`auctions-list` and `auction-detail`) were built in
parallel by two isolated agents on separate git worktrees, then merged; the shared
surface (enum labels, formatters, the detail query key, FSD barrels) was
reconciled by hand at merge time.

## Decisions I made myself

`TODO(you): confirm these are yours and add any others.`

- **Client-state library: MobX** (over Zustand) for pointwise UI state.
- **Change granularity:** 7 OpenSpec changes (bootstrap → api/mocks → list →
  detail → bets → place-bet → docs), rather than fewer, larger changes.
- **Parallelization:** run list and detail as two isolated worktree agents and
  merge, rather than sequentially or in a shared workspace.
- **Language policy:** English for code/comments/docs/commits; Russian kept for
  the product UI and domain/mock data.
- **Acceptance-test policy:** every change must ship unit + integration tests, plus
  Playwright e2e for end-to-end paths, tied to its spec scenarios.

## AI suggestions I rejected / corrected

- The initial design placed the Zod contract schemas in the `entities` layer, with
  `shared/api` depending on them. That violates FSD (the MSW mock lives in `shared`
  and `shared` cannot import "up"). Corrected: the raw contract lives in
  `shared/api`; `entities` holds view-model mappers on top.
- `TODO(you): add any other suggestions you pushed back on.`

## What I reviewed especially carefully

- **Contract fidelity:** enum handling (every enum has an `Unknown` fallback and
  unknown values coerce to it), nullable fields, and the error shapes
  (`ProblemDetail` vs the 422 `ValidationProblem` with `errors[]`).
- **DTO restriction flags** on the detail page: `hide_points_address_and_contacts`,
  `no_view_cargo_price`, `hide_bets_history`, `can_set_bet` — applied centrally in
  one gate mapper and asserted per flag.
- **The mock mutation** on a successful bid (current price, own-bid state, trading
  status, bets list) — the observable end-to-end behavior the task asks for.
- **The merge** of the two parallel branches (union of labels/formatters without
  breaking either side's tests).
- `TODO(you): add the areas you personally scrutinized.`

## Remaining risks

- The mock ranks bids by lowest price; the real per-auction-type logic
  (Up/Down/Request/FixPrice) is not modelled, so trading status after a bid is a
  simplification.
- Only the minimum required list filters are wired end-to-end (the builder and Zod
  schema support the rest, but they are untested for the unwired fields).
- `shared/api/mock/cities.ts` is imported by app UI; the dictionary would be
  cleaner in a non-mock shared module.
- Contract schemas are hand-written from the OpenAPI file; a schema drift from the
  source would only be caught by the mock's own contract tests.

## What I'd improve with another day

- Model per-auction-type ranking and richer trading-status transitions in the mock.
- Wire the full filter set (dates ranges, price/weight/volume, statuses arrays) and
  add tests for each.
- Extract the city dictionary out of `shared/api/mock` into a proper shared config;
  consider generating the Zod schemas from the OpenAPI file to prevent drift.
- Add loading/disabled affordances during the bid submission and optimistic UI.
- `TODO(you): your own priorities.`
