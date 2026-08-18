import type {
  AucTypeFilter,
  FiltersSearch,
  StatusFilter,
} from '@shared/lib/search'
import {
  AUCTION_TYPE_LABELS,
  AUCTION_STATUS_LABELS,
  TRADING_STATUS_LABELS,
} from '@entities/auction'

export interface ActiveChip {
  id: string
  label: string
}

// Numeric auction status codes → labels (mirror of the filter UI options).
const STATUS_CODE_LABELS: Record<number, keyof typeof AUCTION_STATUS_LABELS> = {
  1: 'Planning',
  2: 'Auction',
  3: 'DeterminateWinner',
  4: 'WaitDeal',
  5: 'InProgress',
  6: 'Finished',
  7: 'Stopped',
  8: 'Canceled',
}

/** Human-readable chips for the currently active filters (excludes pagination). */
export function activeChips(s: FiltersSearch): ActiveChip[] {
  const chips: ActiveChip[] = []
  if (s.cargo_num) chips.push({ id: 'cargo_num', label: `№ ${s.cargo_num}` })
  s.auc_type?.forEach((t) =>
    chips.push({ id: `auc_type:${t}`, label: AUCTION_TYPE_LABELS[t as AucTypeFilter] }),
  )
  s.status?.forEach((t) =>
    chips.push({ id: `status:${t}`, label: TRADING_STATUS_LABELS[t as StatusFilter] }),
  )
  s.statuses?.forEach((c) =>
    chips.push({
      id: `statuses:${c}`,
      label: AUCTION_STATUS_LABELS[STATUS_CODE_LABELS[c] ?? 'Unknown'],
    }),
  )
  if (s.load_city) chips.push({ id: 'load_city', label: `Из: ${s.load_city}` })
  if (s.unload_city) chips.push({ id: 'unload_city', label: `В: ${s.unload_city}` })
  if (s.load_date_from)
    chips.push({ id: 'load_date_from', label: `Погрузка от ${s.load_date_from.slice(0, 10)}` })
  if (s.load_date_to)
    chips.push({ id: 'load_date_to', label: `Погрузка до ${s.load_date_to.slice(0, 10)}` })
  if (s.price_from != null)
    chips.push({ id: 'price_from', label: `Цена от ${s.price_from}` })
  if (s.price_to != null)
    chips.push({ id: 'price_to', label: `Цена до ${s.price_to}` })
  if (s.is_available) chips.push({ id: 'is_available', label: 'Доступные' })
  if (s.is_bidder) chips.push({ id: 'is_bidder', label: 'Мои участия' })
  return chips
}

export function countActiveFilters(s: FiltersSearch): number {
  return activeChips(s).length
}

/** Returns a new search with the chip's filter removed (resets to page 1). */
export function removeChip(s: FiltersSearch, id: string): FiltersSearch {
  const [field, value] = id.split(':')
  const next = { ...s } as Record<string, unknown>
  if (value !== undefined) {
    const arr = next[field] as (string | number)[] | undefined
    const kept = arr?.filter((v) => String(v) !== value)
    next[field] = kept && kept.length ? kept : undefined
  } else {
    next[field] = undefined
  }
  next.page = undefined
  return next as FiltersSearch
}
