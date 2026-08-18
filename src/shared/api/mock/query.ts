import type {
  AuctionListMeta,
  AuctionListRequest,
  AuctionStatus,
} from '../contract'
import type { MockAuction } from './types'

/** Числовые коды статуса аукциона (фильтр `statuses`, 1–8). */
const STATUS_CODE: Record<AuctionStatus, number> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
  Unknown: 0,
}

const time = (iso: string): number => new Date(iso).getTime()

/** Применяет фильтры к аукционам store. Пустые фильтры игнорируются. */
export function filterAuctions(
  auctions: MockAuction[],
  f: AuctionListRequest,
): MockAuction[] {
  return auctions.filter((a) => {
    const { main, trading, route } = a.listItem

    if (f.cargo_num && !main.cargo_num.includes(f.cargo_num.trim())) return false

    if (f.auc_type?.length && !f.auc_type.includes(main.auc_type)) return false

    if (f.statuses?.length && !f.statuses.includes(STATUS_CODE[trading.status]))
      return false

    if (f.status?.length && !f.status.includes(trading.status_mobile))
      return false

    if (f.load_city && route.load.city !== f.load_city) return false
    if (f.unload_city && route.unload.city !== f.unload_city) return false

    if (f.load_date_from && time(route.load.date) < time(f.load_date_from))
      return false
    if (f.load_date_to && time(route.load.date) > time(f.load_date_to))
      return false

    const current = trading.price?.current ?? null
    if (f.current_price_from != null && (current == null || current < f.current_price_from))
      return false
    if (f.current_price_to != null && (current == null || current > f.current_price_to))
      return false

    if (f.is_available === true && !trading.is_available) return false
    if (f.is_bidder === true && !trading.is_bidder) return false

    return true
  })
}

export interface PageResult {
  items: MockAuction[]
  meta: AuctionListMeta
}

/** Пагинация с расчётом `meta` (current_page, last_page, total, from, to). */
export function paginate(
  items: MockAuction[],
  page = 1,
  perPage = 20,
): PageResult {
  const total = items.length
  const safePerPage = perPage > 0 ? perPage : 20
  const lastPage = total === 0 ? 1 : Math.ceil(total / safePerPage)
  const currentPage = Math.min(Math.max(page, 1), lastPage)
  const start = (currentPage - 1) * safePerPage
  const pageItems = items.slice(start, start + safePerPage)

  return {
    items: pageItems,
    meta: {
      current_page: currentPage,
      per_page: safePerPage,
      total,
      last_page: lastPage,
      from: total === 0 ? 0 : start + 1,
      to: total === 0 ? 0 : start + pageItems.length,
    },
  }
}
