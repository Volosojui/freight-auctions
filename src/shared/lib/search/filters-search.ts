import { z } from 'zod'
import {
  buildAuctionListRequest,
  type AuctionListRequest,
} from '@shared/api'

/**
 * Search-params schema for the auctions list. Every field has a safe fallback
 * so a malformed URL degrades to defaults instead of crashing the page
 * (validateSearch requirement).
 */

const AUCTION_TYPES = ['Request', 'Up', 'Down', 'FixPrice'] as const
const TRADING_STATUSES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
] as const

const optionalString = z.string().min(1).optional().catch(undefined)
const optionalNumber = z.coerce.number().finite().optional().catch(undefined)
const optionalBool = z
  .preprocess((v) => {
    if (v === 'true' || v === true) return true
    if (v === 'false' || v === false) return false
    return undefined
  }, z.boolean().optional())
  .catch(undefined)

/** Keeps only known members of a string-enum array; drops the rest. */
const enumArray = <T extends readonly [string, ...string[]]>(members: T) =>
  z
    .preprocess(
      (v) => (Array.isArray(v) ? v : v == null ? undefined : [v]),
      z.array(z.enum(members)).optional(),
    )
    .catch(undefined)

const numberArray = z
  .preprocess(
    (v) => (Array.isArray(v) ? v : v == null ? undefined : [v]),
    z.array(z.coerce.number().int()).optional(),
  )
  .catch(undefined)

// page/per_page are optional (not defaulted) so a bare "/" URL stays clean;
// consumers treat undefined as page 1 / per_page 20.
export const filtersSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().catch(undefined),
  per_page: z.coerce.number().int().positive().max(100).optional().catch(undefined),
  cargo_num: optionalString,
  status: enumArray(TRADING_STATUSES),
  statuses: numberArray,
  auc_type: enumArray(AUCTION_TYPES),
  load_city: optionalString,
  unload_city: optionalString,
  load_date_from: optionalString,
  load_date_to: optionalString,
  is_available: optionalBool,
  is_bidder: optionalBool,
  price_from: optionalNumber,
  price_to: optionalNumber,
})

export type FiltersSearch = z.infer<typeof filtersSearchSchema>

/** Filter member type for the auction-type facet (excludes `Unknown`). */
export type AucTypeFilter = NonNullable<FiltersSearch['auc_type']>[number]

export const DEFAULT_PAGE = 1
export const DEFAULT_PER_PAGE = 20
export const DEFAULT_SEARCH: FiltersSearch = {}

/**
 * Parses raw search params into a validated FiltersSearch, substituting safe
 * fallbacks for anything invalid. Never throws — used as the route's
 * `validateSearch`.
 */
export function parseSearch(raw: Record<string, unknown>): FiltersSearch {
  const result = filtersSearchSchema.safeParse(raw ?? {})
  if (result.success) return stripUndefined(result.data)
  return { ...DEFAULT_SEARCH }
}

/** Removes undefined keys so navigation produces clean URLs. */
export function serializeSearch(search: FiltersSearch): FiltersSearch {
  return stripUndefined(search)
}

function stripUndefined(search: FiltersSearch): FiltersSearch {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined) continue
    if (Array.isArray(value) && value.length === 0) continue
    out[key] = value
  }
  return out as FiltersSearch
}

/** Maps validated search params to the API list request body. */
export function searchToListRequest(search: FiltersSearch): AuctionListRequest {
  return buildAuctionListRequest({
    page: search.page ?? DEFAULT_PAGE,
    per_page: search.per_page ?? DEFAULT_PER_PAGE,
    cargo_num: search.cargo_num,
    status: search.status,
    statuses: search.statuses,
    auc_type: search.auc_type,
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: search.load_date_from,
    load_date_to: search.load_date_to,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.price_from,
    current_price_to: search.price_to,
  })
}
