import { http, HttpResponse, type RequestHandler } from 'msw'
import { API_BASE_URL } from '../http-client'
import { auctionListRequestSchema, setBetRequestSchema } from '../contract'
import type { ProblemDetail, ValidationProblem } from '../problem'
import { getStore } from './store'
import { filterAuctions, paginate } from './query'
import { placeBet } from './mutations'

const url = (path: string): string => `${API_BASE_URL}${path}`

function notFound(message: string) {
  const body: ProblemDetail = {
    code: 'resource_not_found',
    title: 'Не найдено',
    message,
    trace_id: null,
  }
  return HttpResponse.json(body, { status: 404 })
}

/**
 * MSW-хендлеры аукционов поверх stateful in-memory store.
 * Read-эндпоинты реализованы полностью; `setBet` соблюдает контур статусов
 * без мутации store (реальная мутация — в change `place-bet`).
 */
export const handlers: RequestHandler[] = [
  // POST /auctions/list — фильтры, пагинация, meta.
  http.post(url('/auctions/list'), async ({ request }) => {
    const raw = await request.json().catch(() => ({}))
    const parsed = auctionListRequestSchema.safeParse(raw)
    const filters = parsed.success ? parsed.data : {}

    const filtered = filterAuctions(getStore().auctions, filters)
    const { items, meta } = paginate(
      filtered,
      filters.page ?? 1,
      filters.per_page ?? 20,
    )

    return HttpResponse.json({ data: items.map((i) => i.listItem), meta })
  }),

  // GET /auctions/{auctionUuid} — детальный DTO; 404 для неизвестного uuid.
  http.get(url('/auctions/:auctionUuid'), ({ params }) => {
    const auction = getStore().byUuid.get(String(params.auctionUuid))
    if (!auction) return notFound('Заявка не найдена')
    return HttpResponse.json(auction.detail)
  }),

  // GET /auctions/{auctionUuid}/bets — ставки; согласованность с hide_bets_history.
  http.get(url('/auctions/:auctionUuid/bets'), ({ params }) => {
    const auction = getStore().byUuid.get(String(params.auctionUuid))
    if (!auction) return notFound('Заявка не найдена')
    const bets = auction.detail.hide_bets_history ? [] : auction.bets
    return HttpResponse.json({ bets })
  }),

  // POST /auctions/{auctionUuid}/bets — контур 200/404/422 без мутации store.
  http.post(url('/auctions/:auctionUuid/bets'), async ({ params, request }) => {
    const auction = getStore().byUuid.get(String(params.auctionUuid))
    if (!auction) return notFound('Заявка не найдена')

    const raw = await request.json().catch(() => null)
    const parsed = setBetRequestSchema.safeParse(raw)
    if (!parsed.success) {
      const problem: ValidationProblem = {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        trace_id: null,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'price',
          message: issue.message,
          code: null,
        })),
      }
      return HttpResponse.json(problem, { status: 422 })
    }

    const bet = placeBet(getStore(), String(params.auctionUuid), parsed.data.price)
    return HttpResponse.json({ ok: true, bet })
  }),
]
