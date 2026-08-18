import type { BetItem } from '@shared/api'
import { formatDateTime, formatMoney } from '@entities/auction'

export interface BetRowVM {
  id: number
  createdAt: string
  /** Carrier display name: organization, else contact, else a fallback. */
  carrier: string
  contactName: string
  contactPhone: string | null
  priceWithVat: string
  priceNoVat: string
  place: number | null
  isWin: boolean
  isRejected: boolean
  isCounter: boolean
  /** Reason for cancellation, or null when not cancelled. */
  cancelReason: string | null
}

// Contract uses empty strings for "not set"; normalize them to null.
const emptyToNull = (s: string): string | null => (s.trim() === '' ? null : s)

export function toBetRowVM(bet: BetItem): BetRowVM {
  return {
    id: bet.id,
    createdAt: formatDateTime(bet.created_at),
    carrier:
      emptyToNull(bet.organization_name) ??
      emptyToNull(bet.contact_name) ??
      'Перевозчик',
    contactName: bet.contact_name,
    contactPhone: emptyToNull(bet.contact_phone),
    priceWithVat: formatMoney(bet.price_with_vat) ?? '—',
    priceNoVat: formatMoney(bet.price_no_vat) ?? '—',
    place: bet.place,
    isWin: bet.is_win,
    isRejected: bet.is_rejected,
    isCounter: bet.is_counter,
    cancelReason: emptyToNull(bet.cancel_reason),
  }
}

export interface BetsVM {
  rows: BetRowVM[]
  /** Distinct carriers with a live (non-rejected) bet. */
  participants: number
}

export function toBetsVM(bets: BetItem[]): BetsVM {
  const liveOrgs = new Set(
    bets.filter((b) => !b.is_rejected).map((b) => b.organization_id),
  )
  return {
    rows: bets.map(toBetRowVM),
    participants: liveOrgs.size,
  }
}
