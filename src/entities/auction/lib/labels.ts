import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  OperationType,
  PaymentDelayType,
  TradingStatus,
} from '@shared/api'

// Human-readable labels for contract enums. UI copy stays Russian (product
// domain); the `Unknown` member always has a safe, non-empty fallback.

const DASH = '—'

const AUCTION_TYPE: Record<AuctionType, string> = {
  Request: 'Запрос цены',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: DASH,
}

const AUCTION_STATUS: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Идут торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: DASH,
}

const TRADING_STATUS: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Перебит',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждён',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принят',
  Unknown: DASH,
}

const BID_MEASUREMENT: Record<BidMeasurementType, string> = {
  PerRoute: 'За рейс',
  PerKm: 'За км',
  Unknown: DASH,
}

const PAYMENT_DELAY: Record<PaymentDelayType, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: DASH,
}

const OPERATION_TYPE: Record<OperationType, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: DASH,
}

export const auctionTypeLabel = (v: AuctionType): string => AUCTION_TYPE[v]
export const auctionStatusLabel = (v: AuctionStatus): string =>
  AUCTION_STATUS[v]
export const tradingStatusLabel = (v: TradingStatus): string =>
  TRADING_STATUS[v]
export const bidMeasurementLabel = (v: BidMeasurementType): string =>
  BID_MEASUREMENT[v]
export const paymentDelayLabel = (v: PaymentDelayType): string =>
  PAYMENT_DELAY[v]
export const operationTypeLabel = (v: OperationType): string =>
  OPERATION_TYPE[v]
