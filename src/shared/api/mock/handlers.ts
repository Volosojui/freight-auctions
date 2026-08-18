import type { RequestHandler } from 'msw'

/**
 * MSW-хендлеры аукционов.
 *
 * На этапе `bootstrap-app` список пуст — реальные хендлеры и stateful-store
 * добавляются в change `api-and-mocks`. Пустой набор оставляет каркас
 * работоспособным: неперехваченные запросы пропускаются (`bypass` в dev,
 * `error` в тестах — см. настройку старта воркера/сервера).
 */
export const handlers: RequestHandler[] = []
