import type { AuctionListItem, AuctionType } from '@shared/api'
import {
  auctionStatusLabel,
  auctionTypeLabel,
  bidMeasurementLabel,
  tradingStatusLabel,
} from '../lib/labels'
import {
  formatDate,
  formatPrice,
  formatPricePerKm,
  formatWeightVolume,
} from '../lib/formatters'

export type PrimaryActionKind = 'create' | 'edit' | 'view' | 'disabled'

export interface PrimaryAction {
  kind: PrimaryActionKind
  label: string
  disabled: boolean
}

export interface AuctionCardVM {
  uuid: string
  cargoNum: string
  typeLabel: string
  statusLabel: string
  tradingStatusLabel: string
  route: { from: string; to: string }
  loadDate: string
  unloadDate: string
  cargo: { name: string; weightVolume: string; bodyType: string }
  currentPrice: string
  pricePerKm: string
  step: string
  hasOwnBet: boolean
  primaryAction: PrimaryAction
}

/**
 * Computes the primary action from the trading flags:
 * - can set a bet + already has one → edit
 * - can set a bet, none yet → create
 * - cannot set a bet → view bets (or disabled for terminal statuses)
 */
export function resolvePrimaryAction(item: AuctionListItem): PrimaryAction {
  const { trading } = item
  const hasOwnBet = trading.your?.bet ?? false

  if (trading.can_set_bet) {
    return hasOwnBet
      ? { kind: 'edit', label: 'Изменить ставку', disabled: false }
      : { kind: 'create', label: 'Сделать ставку', disabled: false }
  }

  const terminal =
    trading.status === 'Canceled' || trading.status === 'Stopped'
  if (terminal && !hasOwnBet) {
    return { kind: 'disabled', label: 'Торги закрыты', disabled: true }
  }

  return { kind: 'view', label: 'Смотреть ставки', disabled: false }
}

export function toAuctionCardVM(item: AuctionListItem): AuctionCardVM {
  const { main, route, cargo, trading } = item
  const measurement = bidMeasurementLabel(trading.bid_measurement_type)
  const pricePerKm = main.price_per_km
  const measurementSuffix = measurement ? ` (${measurement})` : ''

  return {
    uuid: main.order_uid,
    cargoNum: main.cargo_num,
    typeLabel: auctionTypeLabel(main.auc_type as AuctionType),
    statusLabel: auctionStatusLabel(trading.status),
    tradingStatusLabel: tradingStatusLabel(trading.status_mobile),
    route: { from: route.load.city, to: route.unload.city },
    loadDate: formatDate(route.load.date),
    unloadDate: formatDate(route.unload.date),
    cargo: {
      name: cargo.name,
      weightVolume: formatWeightVolume(cargo.weight, cargo.volume),
      bodyType: cargo.body_type,
    },
    currentPrice: formatPrice(trading.price?.current ?? null),
    // Bid step is only present in the detail DTO, not the list item.
    pricePerKm:
      pricePerKm == null ? '—' : `${formatPricePerKm(pricePerKm)}${measurementSuffix}`,
    step: '—',
    hasOwnBet: trading.your?.bet ?? false,
    primaryAction: resolvePrimaryAction(item),
  }
}
