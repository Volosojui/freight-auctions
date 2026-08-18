import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** Браузерный MSW-воркер (dev). Стартуется из точки входа только в DEV. */
export const worker = setupWorker(...handlers)
