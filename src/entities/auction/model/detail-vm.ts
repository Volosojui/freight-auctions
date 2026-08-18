import type { AuctionShowResponse } from '@shared/api'
import {
  auctionStatusLabel,
  auctionTypeLabel,
  bidMeasurementLabel,
  formatDate,
  formatDateTime,
  formatMoney,
  formatPricePerKm,
  operationTypeLabel,
  paymentDelayLabel,
  tradingStatusLabel,
} from '../lib'

export interface DetailFlags {
  /** Bidding action is allowed (trading.can_set_bet). */
  canSetBet: boolean
  /** Bets history is reachable (!trading.hide_bets_history). */
  canViewBets: boolean
  /** Point addresses and organizer contacts are hidden. */
  hidePointsAndContacts: boolean
  /** Cargo declared price is hidden. */
  hideCargoPrice: boolean
}

export interface ContactVM {
  name: string | null
  phone: string | null
  workPhone: string | null
  email: string | null
}

export interface RoutePointVM {
  opTypeLabel: string
  startDate: string
  endDate: string
  cityName: string
  cityFullName: string
  /** null when addresses are hidden. */
  address: string | null
  cargoName: string
  /** null when contacts are hidden. */
  contact: { name: string; phone: string } | null
}

export interface PriceVM {
  current: string | null
  currentNoVat: string | null
  available: string | null
  availableNoVat: string | null
  min: string | null
  max: string | null
  step: string | null
  pricePerKm: string
}

export interface YourBetVM {
  hasBet: boolean
  lastBet: string | null
  lastBetWithVat: string | null
  win: boolean
}

export interface CargoVM {
  /** null when hidden by no_view_cargo_price. */
  price: string | null
  bodyType: string
  distanceKm: number | null
  truckCount: number
  isInternational: boolean
  car: {
    type: string
    weight: number | null
    volume: number | null
    length: number | null
    width: number | null
    height: number | null
  }
  loadingTypes: string[]
  docs: string[]
}

export interface PaymentVM {
  form: string
  condition: string | null
  delay: string | null
  currency: string
}

export interface DetailVM {
  cargoNum: string
  aucTypeLabel: string
  createdAt: string
  cargoDate: string
  auctionStatusLabel: string
  tradingStatusLabel: string
  organizer: { name: string; inn: string; kpp: string }
  /** null when contacts are hidden. */
  contacts: ContactVM[] | null
  route: RoutePointVM[]
  cargo: CargoVM
  payment: PaymentVM
  trading: {
    startTime: string
    stopTime: string
    bidMeasurementLabel: string
  }
  price: PriceVM
  your: YourBetVM
  flags: DetailFlags
}

function loadingTypeLabels(t: AuctionShowResponse['cargo']['loading_types']): string[] {
  const out: string[] = []
  if (t.side) out.push('Боковая')
  if (t.top) out.push('Верхняя')
  if (t.rear) out.push('Задняя')
  if (t.full) out.push('Полная растентовка')
  return out
}

function docLabels(d: AuctionShowResponse['cargo']['docs']): string[] {
  const out: string[] = []
  if (d.tir) out.push('TIR')
  if (d.cmr) out.push('CMR')
  if (d.t1) out.push('T1')
  if (d.med) out.push('Мед. книжка')
  return out
}

/**
 * Pure mapper: AuctionShowResponse -> DetailVM. This is the single place that
 * applies the DTO restriction flags, so the UI renders the VM without
 * re-checking flags:
 *   - hide_points_address_and_contacts -> route addresses + organizer contacts
 *   - no_view_cargo_price              -> cargo price
 *   - hide_bets_history                -> canViewBets
 *   - can_set_bet                      -> canSetBet
 */
export function toDetailVM(response: AuctionShowResponse): DetailVM {
  const { main, organizer, contacts, cargo, trading, payment, routes } =
    response

  const hidePointsAndContacts = trading.hide_points_address_and_contacts
  const hideCargoPrice = trading.no_view_cargo_price

  const flags: DetailFlags = {
    canSetBet: trading.can_set_bet,
    canViewBets: !trading.hide_bets_history,
    hidePointsAndContacts,
    hideCargoPrice,
  }

  const price = trading.price
  const your = trading.your

  return {
    cargoNum: main.cargo_num,
    aucTypeLabel: auctionTypeLabel(main.auc_type),
    createdAt: formatDateTime(main.created_at),
    cargoDate: formatDate(main.cargo_date),
    auctionStatusLabel: auctionStatusLabel(trading.status),
    tradingStatusLabel: tradingStatusLabel(trading.status_mobile),
    organizer: {
      name: organizer.organization_name,
      inn: organizer.organization_inn,
      kpp: organizer.organization_kpp,
    },
    contacts: hidePointsAndContacts
      ? null
      : contacts.map((c) => ({
          name: c.name,
          phone: c.phone,
          workPhone: c.work_phone,
          email: c.email,
        })),
    route: routes.map((point) => ({
      opTypeLabel: operationTypeLabel(point.op_type),
      startDate: formatDateTime(point.start_date),
      endDate: formatDateTime(point.end_date),
      cityName: point.location.city_name,
      cityFullName: point.location.city_full_name,
      address: hidePointsAndContacts ? null : point.location.loading_address,
      cargoName: point.cargo.name,
      contact: hidePointsAndContacts
        ? null
        : { name: point.contact.name, phone: point.contact.phone },
    })),
    cargo: {
      price: hideCargoPrice ? null : cargo.price,
      bodyType: cargo.body_type,
      distanceKm: cargo.distance,
      truckCount: cargo.truck_count,
      isInternational: cargo.is_international,
      car: {
        type: cargo.car.type,
        weight: cargo.car.weight,
        volume: cargo.car.volume,
        length: cargo.car.length,
        width: cargo.car.width,
        height: cargo.car.height,
      },
      loadingTypes: loadingTypeLabels(cargo.loading_types),
      docs: docLabels(cargo.docs),
    },
    payment: {
      form: payment.form,
      condition: payment.condition ?? payment.condition_predefined,
      delay:
        payment.delay !== null
          ? `${payment.delay} ${paymentDelayLabel(payment.delay_type)}`
          : null,
      currency: payment.currency_code,
    },
    trading: {
      startTime: formatDateTime(trading.start_time),
      stopTime: formatDateTime(trading.stop_time),
      bidMeasurementLabel: bidMeasurementLabel(trading.bid_measurement_type),
    },
    price: {
      current: formatMoney(price.current),
      currentNoVat: formatMoney(price.current_no_vat),
      available: formatMoney(price.available),
      availableNoVat: formatMoney(price.available_no_vat),
      min: formatMoney(price.min),
      max: formatMoney(price.max),
      step: formatMoney(price.step),
      pricePerKm: formatPricePerKm(price.price_per_km),
    },
    your: {
      hasBet: your.bet,
      lastBet: formatMoney(your.last_bet),
      lastBetWithVat: formatMoney(your.last_bet_with_vat),
      win: your.win,
    },
    flags,
  }
}
