import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** Node MSW-сервер для тестов (Vitest setup). */
export const server = setupServer(...handlers)
