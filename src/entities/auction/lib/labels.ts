import type {
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  TradingStatus,
} from '@shared/api'

// User-visible labels stay in Russian (product domain). Keys mirror the
// OpenAPI enum values; every enum includes an `Unknown` fallback.

export const AUCTION_TYPE_LABELS: Record<AuctionType, string> = {
  Request: 'Запрос цены',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: 'Неизвестно',
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
  Unknown: 'Неизвестно',
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
  Unknown: 'Неизвестно',
}

export const BID_MEASUREMENT_LABELS: Record<BidMeasurementType, string> = {
  PerRoute: 'за рейс',
  PerKm: 'за км',
  Unknown: '',
}

export const auctionTypeLabel = (v: AuctionType): string =>
  AUCTION_TYPE_LABELS[v] ?? AUCTION_TYPE_LABELS.Unknown

export const auctionStatusLabel = (v: AuctionStatus): string =>
  AUCTION_STATUS_LABELS[v] ?? AUCTION_STATUS_LABELS.Unknown

export const tradingStatusLabel = (v: TradingStatus): string =>
  TRADING_STATUS_LABELS[v] ?? TRADING_STATUS_LABELS.Unknown

export const bidMeasurementLabel = (v: BidMeasurementType | null): string =>
  v ? (BID_MEASUREMENT_LABELS[v] ?? '') : ''
