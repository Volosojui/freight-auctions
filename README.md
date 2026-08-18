# Freight Auctions

A single-page app for freight auctions, built against the provided OpenAPI
contract (`docs/openapi.auctions.v0.json`). It lists auctions, shows an auction
detail page with a bets tab, and lets the user place a bid. There is no real
backend — the API is served by MSW mocks that mirror the contract and mutate
state on writes.

> The product UI copy and freight domain data are in Russian by design; the code,
> comments, and docs are in English.

## Tech stack

- **React 18** + **TypeScript** (strict) + **Vite**
- **TanStack Router** (type-safe routing, URL search params)
- **TanStack Query** (server state: caching, invalidation, prefetch)
- **React Hook Form** + **Zod** (forms and validation)
- **MobX** (`mobx-react-lite`) — pointwise client UI state only
- **MSW** — stateful in-memory mock backend
- **Feature-Sliced Design** — enforced with ESLint (`eslint-plugin-boundaries`)
- **Vitest** + Testing Library (unit / integration), **Playwright** (e2e)

## Getting started

```bash
npm install

npm run dev          # start the dev server (MSW mocks enabled) at http://localhost:5173
npm run build        # type-check + production build
npm run preview      # preview the production build

npm run lint         # ESLint (FSD boundaries + *.component.tsx naming)
npm run format       # Prettier

npm run test         # unit + integration (Vitest, jsdom + MSW)
npm run test:e2e:install   # one-time: download the Playwright Chromium browser
npm run test:e2e     # end-to-end (Playwright; auto-starts the dev server)
```

## Architecture

Feature-Sliced Design, top→bottom (imports only ever go down a layer):

```
app        providers (QueryClient), router, root layout, error boundary
pages      auctions-list, auction-detail (with bets tab + bid modal)
widgets    auctions-list, auction-detail (sections), bets-list
features   auction-filters, place-bet
entities   auction (view models, labels, formatters, detail query), bet
shared     api (contract + transport + MSW mock), ui, lib
```

- **API contract lives in `shared/api`.** Zod schemas mirror every DTO (enums with
  an `Unknown` fallback, nullable fields, `ProblemDetail` / `ValidationProblem`),
  and TS types are inferred from them. Endpoint functions validate responses
  against the schemas. The contract sits in `shared` (not `entities`) so the MSW
  mock — which also lives in `shared` — and the response validation both stay
  FSD-valid (`shared` can't import "up").
- **State split.** Server state is owned exclusively by TanStack Query. MobX is
  used pointwise for local UI state only (the filter draft store, the bid form's
  server-error banner, the toast queue) — never to duplicate what Query or the
  router already hold.
- **Routing / URL as source of truth.** List filters and pagination live in the
  URL search params, validated by Zod with safe fallbacks. The bid form is an
  addressable modal opened via `?bid` on the detail route.

### Mock backend (MSW)

A single in-memory store seeds 6 auctions chosen to cover the contract's edge
cases: every auction type and status, `can_set_bet` true/false,
`hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`,
with/without an own bid, and an empty bets list. Read endpoints apply filters and
paginate with a correct `meta`. `POST …/bets` validates the body (422 on
`price <= 0`) and, on success, mutates the store: it appends the bet, recomputes
places, and updates the current price, the user's bid state and trading status —
so the change is observable after query invalidation.

MSW is started only in dev and tests (dynamic import guarded by
`import.meta.env.DEV`), so the mock worker, handlers and seed are excluded from
the production bundle. The shared city dictionary (`shared/api/mock/cities.ts`)
is intentionally bundled, because the filter's city dropdown consumes it.

## Verification

This project was verified with an automated test suite plus manual checks in the
running app.

**Automated (all green):**

- `npm run lint` — no errors (FSD import boundaries + `*.component.tsx` naming).
- `npm run test` — **89 unit + integration tests** (Vitest, jsdom + MSW).
- `npm run test:e2e` — **17 end-to-end tests** (Playwright, real Chromium).
- `npm run build` — type-checks and builds; the MSW backend is not in the bundle.

**Scenarios covered:**

- **List:** loading skeleton, empty and error states; filters synced to the URL
  and restored from it; Zod fallback on a malformed URL; pagination; prefetch of
  the detail on hover; card primary action by state.
- **Detail:** all sections; prices (current / available / min / max / step);
  own-bid state; 404 → not-found; DTO restrictions —
  `hide_points_address_and_contacts`, `no_view_cargo_price`, `hide_bets_history`,
  `can_set_bet = false`.
- **Bets:** list with dual VAT prices, carrier, rank, winner highlight, cancelled
  bid + reason, participant count; empty state; hidden-history state.
- **Place bid:** client validation (empty / ≤ 0 / out of range / off-step),
  422 field errors mapped back to the form, success/error toasts, invalidation,
  and the end-to-end path where the current price, trading status and bets update.
- **Pure logic (unit):** search-params parse/serialize, request builder, view-model
  mappers, error parser, the bid Zod schema, and the store mutation.

**Known limitations:**

- The mock ranks bids by lowest price (a simplification; the real per-type
  auction logic — Up/Down/Request/FixPrice — is not modelled).
- No auth, real-time updates, or optimistic UI; freshness relies on invalidation.
- Only the minimum set of list filters required by the task is wired (the request
  builder and Zod schema are ready for the rest).
- `shared/api/mock/cities.ts` is consumed by app UI; it would be cleaner in a
  non-mock shared location.

## How it was built

Planned and implemented with the OpenSpec spec-driven workflow: each capability
is a change with a proposal, design, spec (with WHEN/THEN scenarios) and tasks,
implemented against acceptance tests and archived once green. Archived changes and
the synced main specs live under `openspec/`. See `AI_USAGE.md` for the AI-usage
account.
