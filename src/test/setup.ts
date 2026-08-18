import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '@shared/api/mock/server'

// jsdom не реализует scrollTo; TanStack Router вызывает его при scroll-restoration.
vi.stubGlobal('scrollTo', () => {})

// Единый MSW-сервер на прогон тестов: неперехваченные запросы = ошибка,
// чтобы контрактные расхождения всплывали сразу.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })

  // jsdom's AbortSignal is a different class than the one Node's fetch (undici)
  // validates against, so the signal TanStack Query passes is rejected with
  // "Expected signal to be an instance of AbortSignal". Strip the signal in the
  // test environment only; request cancellation does not affect assertions and
  // the real browser build is unaffected.
  const patchedFetch = globalThis.fetch
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (init && 'signal' in init) {
      const { signal, ...rest } = init
      void signal
      return patchedFetch(input, rest)
    }
    return patchedFetch(input, init)
  }) as typeof fetch
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// jsdom's AbortSignal is not an instance of Node's, so undici's fetch/Request
// reject it ("Expected signal to be an instance of AbortSignal"). Strip the
// signal in tests only (installed after MSW patches fetch, so it sits
// outermost). Production keeps request cancellation intact.
let restoreFetch: typeof globalThis.fetch | undefined
beforeAll(() => {
  const patchedFetch = globalThis.fetch
  restoreFetch = patchedFetch
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (init && 'signal' in init) {
      const rest = { ...init }
      delete rest.signal
      return patchedFetch(input, rest)
    }
    return patchedFetch(input, init)
  }) as typeof globalThis.fetch
})
afterAll(() => {
  if (restoreFetch) globalThis.fetch = restoreFetch
})
