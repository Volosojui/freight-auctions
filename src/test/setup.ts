import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '@shared/api/mock/server'

// jsdom не реализует scrollTo; TanStack Router вызывает его при scroll-restoration.
vi.stubGlobal('scrollTo', () => {})

// Единый MSW-сервер на прогон тестов: неперехваченные запросы = ошибка,
// чтобы контрактные расхождения всплывали сразу.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
