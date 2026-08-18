import type { BetItem } from '../contract'
import type { MockStore } from './store'

const round2 = (n: number): number => Math.round(n * 100) / 100

// Identity of the "current user" placing bids in the mock.
const ME = {
  organization_id: 22,
  organization_inn: '7800000002',
  organization_name: 'ООО Наша Компания',
  contact_name: 'Наш Водитель',
  contact_phone: '+79115556677',
} as const

/**
 * Applies a successful bid to the store: appends a bet, recomputes places
 * (lowest price wins), and updates the auction's current price, the user's
 * bet state and trading status on both the detail and list representations.
 * Pure over the store — returns the created bet, or null for an unknown uuid.
 */
export function placeBet(
  store: MockStore,
  uuid: string,
  price: number,
): BetItem | null {
  const auction = store.byUuid.get(uuid)
  if (!auction) return null

  const noVat = round2(price / 1.2)
  const nextId = auction.bets.reduce((max, b) => Math.max(max, b.id), 0) + 1

  const bet: BetItem = {
    id: nextId,
    created_at: new Date().toISOString(),
    auction_id: auction.detail.main.id,
    subscriber_id: ME.organization_id,
    contact_name: ME.contact_name,
    contact_phone: ME.contact_phone,
    price_with_vat: price,
    price_no_vat: noVat,
    organization_id: ME.organization_id,
    organization_inn: ME.organization_inn,
    organization_name: ME.organization_name,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: price,
      price_no_vat: noVat,
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
  }
  auction.bets.push(bet)

  // Recompute ranking: lower price is better (place 1).
  const ranked = auction.bets
    .filter((b) => !b.is_rejected)
    .sort((a, b) => a.price_with_vat - b.price_with_vat)
  ranked.forEach((b, i) => {
    b.place = i + 1
    b.is_win = false
  })

  const leading = bet.place === 1
  const distance = auction.detail.cargo.distance ?? 0
  const pricePerKm = distance > 0 ? round2(noVat / distance) : 0

  // Detail representation.
  const dp = auction.detail.trading.price
  dp.current = price
  dp.current_no_vat = noVat
  dp.price_per_km = pricePerKm
  auction.detail.trading.your = {
    bet: true,
    last_bet: noVat,
    last_bet_with_vat: price,
    win: false,
  }
  auction.detail.trading.is_bidder = true
  auction.detail.trading.status_mobile = leading ? 'Leading' : 'Losing'

  // List representation mirror.
  const lt = auction.listItem.trading
  lt.status_mobile = leading ? 'Leading' : 'Losing'
  lt.is_bidder = true
  lt.your = { bet: true, last_bet: price }
  if (lt.price) {
    lt.price.current = price
    lt.price.current_no_vat = noVat
  }
  auction.listItem.main.price_per_km = pricePerKm

  return bet
}
