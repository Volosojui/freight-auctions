import { makeAutoObservable } from 'mobx'
import type { AucTypeFilter, FiltersSearch } from '@shared/lib/search'

const toNum = (v: string): number | undefined => {
  const n = Number(v)
  return v.trim() !== '' && Number.isFinite(n) ? n : undefined
}

const undef = (v: string): string | undefined =>
  v.trim() === '' ? undefined : v

/**
 * MobX draft store for the filter form. Holds editable state; `toSearch()`
 * produces the URL search object that "Apply" navigates to (page reset to 1).
 */
export class FiltersStore {
  cargoNum = ''
  aucType: AucTypeFilter[] = []
  statuses: number[] = []
  loadCity = ''
  unloadCity = ''
  loadDateFrom = ''
  loadDateTo = ''
  priceFrom = ''
  priceTo = ''
  isAvailable = false
  isBidder = false

  constructor(initial: FiltersSearch) {
    makeAutoObservable(this)
    this.hydrate(initial)
  }

  hydrate(s: FiltersSearch): void {
    this.cargoNum = s.cargo_num ?? ''
    this.aucType = s.auc_type ?? []
    this.statuses = s.statuses ?? []
    this.loadCity = s.load_city ?? ''
    this.unloadCity = s.unload_city ?? ''
    this.loadDateFrom = s.load_date_from ?? ''
    this.loadDateTo = s.load_date_to ?? ''
    this.priceFrom = s.price_from != null ? String(s.price_from) : ''
    this.priceTo = s.price_to != null ? String(s.price_to) : ''
    this.isAvailable = s.is_available ?? false
    this.isBidder = s.is_bidder ?? false
  }

  setField<K extends FiltersTextField>(field: K, value: string): void {
    this[field] = value
  }

  toggleAucType(value: AucTypeFilter): void {
    this.aucType = toggle(this.aucType, value)
  }

  toggleStatus(value: number): void {
    this.statuses = toggle(this.statuses, value)
  }

  toggleFlag(field: 'isAvailable' | 'isBidder'): void {
    this[field] = !this[field]
  }

  reset(): void {
    this.hydrate({ page: 1, per_page: 20 })
  }

  /** Builds the URL search from the draft. Omits page/per_page so applying a
   * filter returns to page 1 with a clean URL. */
  toSearch(): FiltersSearch {
    return {
      cargo_num: undef(this.cargoNum),
      auc_type: this.aucType.length ? this.aucType : undefined,
      statuses: this.statuses.length ? this.statuses : undefined,
      load_city: undef(this.loadCity),
      unload_city: undef(this.unloadCity),
      load_date_from: undef(this.loadDateFrom),
      load_date_to: undef(this.loadDateTo),
      price_from: toNum(this.priceFrom),
      price_to: toNum(this.priceTo),
      is_available: this.isAvailable || undefined,
      is_bidder: this.isBidder || undefined,
    }
  }
}

type FiltersTextField =
  | 'cargoNum'
  | 'loadCity'
  | 'unloadCity'
  | 'loadDateFrom'
  | 'loadDateTo'
  | 'priceFrom'
  | 'priceTo'

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value]
}

export const createFiltersStore = (initial: FiltersSearch): FiltersStore =>
  new FiltersStore(initial)
