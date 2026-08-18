## Context

`src/main.tsx` starts MSW only when `import.meta.env.DEV` is true (a deliberate
earlier decision to keep mock code out of the production bundle, which assumed a
real backend in prod). There is no real backend, and the API base URL is the
absolute mock host `https://auctions.mock/api`. On Netlify the production build
does not start MSW, so `fetch` hits the real network and fails with
`ERR_NAME_NOT_RESOLVED`. See `proposal.md` — Why.

## Goals / Non-Goals

**Goals:**
- The deployed app is fully functional against the MSW mock backend.
- Client-side routes resolve on direct load / refresh on Netlify.

**Non-Goals:**
- Introducing a real backend or an env-gated toggle (decided: mocks are always
  on, since the app is mock-only).
- Changing the mock data, contract, or any feature behavior.

## Decisions

**Start MSW in every environment.** Remove the `import.meta.env.DEV` guard in
`src/main.tsx` so the worker starts on every load (dev, preview, production),
awaited before the first render. The dynamic import stays (keeps the entry async
and the module boundary clean) but is now always reached. _Alternative:_ gate on
`VITE_ENABLE_MOCKS` — rejected per the chosen "always on" scope; the app has no
real API to fall back to.

**Keep the absolute base URL.** With the worker running, the MSW service worker
intercepts the app's requests (including the cross-origin `auctions.mock` host)
before they reach the network, so the absolute URL keeps working and Node tests
(which need an absolute URL) are unaffected. The service worker is served from the
site root (`public/mockServiceWorker.js` → `/mockServiceWorker.js`, scope `/`), so
it controls the page; `worker.start()` is awaited so the SW controls the page
before any request fires. _Alternative:_ switch to a same-origin relative base —
more robust against a missing SW but breaks Node tests and is unnecessary once the
worker always runs.

**Netlify SPA fallback.** Add a redirect (`public/_redirects` with
`/*  /index.html  200`, or an equivalent `netlify.toml`) so deep links and refresh
on `/auctions/…` serve `index.html` and let the client router handle them.

**Production bundle now includes the mock.** This reverses the previous
"no mock code in prod" check; it is expected for a mock-only demo. Update
README/AI_USAGE so the docs match reality.

## Risks / Trade-offs

- [Larger prod bundle / mock data shipped publicly] → Acceptable: the app is a
  mock-only demo with no sensitive data.
- [Service worker caching a stale worker between deploys] → MSW's worker is
  network-first for its own script; a hard refresh clears it. Not a blocker for a
  demo.
- [First-load race: SW not yet controlling the page] → `worker.start()` is awaited
  before render and MSW claims clients on activate, so requests fire only after
  the SW controls the page.

## Open Questions

<!-- none -->
