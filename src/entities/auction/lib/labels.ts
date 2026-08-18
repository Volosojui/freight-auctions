import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  OperationType,
  PaymentDelayType,
  TradingStatus,
} from '@shared/api'

// User-visible labels stay in Russian (product domain). Keys mirror the
// OpenAPI enum values; every enum includes an `Unknown` fallback ("—").

const DASH = '—'

export const AUCTION_TYPE_LABELS: Record<AuctionType, string> = {
  Request: 'Запрос цены',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: DASH,
}

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
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

export const TRADING_STATUS_LABELS: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Перебит',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждён',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принят',
  Unknown: DASH,
}

// Empty for Unknown so it reads cleanly as a price suffix, e.g. "… (За км)".
export const BID_MEASUREMENT_LABELS: Record<BidMeasurementType, string> = {
  PerRoute: 'За рейс',
  PerKm: 'За км',
  Unknown: '',
}

export const PAYMENT_DELAY_LABELS: Record<PaymentDelayType, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: DASH,
}

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: DASH,
}

export const auctionTypeLabel = (v: AuctionType): string =>
  AUCTION_TYPE_LABELS[v]

export const auctionStatusLabel = (v: AuctionStatus): string =>
  AUCTION_STATUS_LABELS[v]

export const tradingStatusLabel = (v: TradingStatus): string =>
  TRADING_STATUS_LABELS[v]

export const bidMeasurementLabel = (v: BidMeasurementType | null): string =>
  v ? BID_MEASUREMENT_LABELS[v] : ''

export const paymentDelayLabel = (v: PaymentDelayType): string =>
  PAYMENT_DELAY_LABELS[v]

export const operationTypeLabel = (v: OperationType): string =>
  OPERATION_TYPE_LABELS[v]
