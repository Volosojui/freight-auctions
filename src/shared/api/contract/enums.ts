import { z } from 'zod'

/**
 * Enum'ы контракта. Каждый включает `Unknown`; неизвестное входящее значение
 * безопасно приводится к `Unknown` через `.catch`, а не роняет парсинг.
 */

export const auctionTypeSchema = z
  .enum(['Request', 'Up', 'Down', 'FixPrice', 'Unknown'])
  .catch('Unknown')
export type AuctionType = z.infer<typeof auctionTypeSchema>

export const auctionStatusSchema = z
  .enum([
    'Planning',
    'Auction',
    'DeterminateWinner',
    'WaitDeal',
    'InProgress',
    'Finished',
    'Stopped',
    'Canceled',
    'Unknown',
  ])
  .catch('Unknown')
export type AuctionStatus = z.infer<typeof auctionStatusSchema>

export const tradingStatusSchema = z
  .enum([
    'NotParticipating',
    'Leading',
    'Losing',
    'OnPending',
    'Confirmed',
    'ChoosingWinner',
    'Winner',
    'Accepted',
    'Unknown',
  ])
  .catch('Unknown')
export type TradingStatus = z.infer<typeof tradingStatusSchema>

export const bidMeasurementTypeSchema = z
  .enum(['PerRoute', 'PerKm', 'Unknown'])
  .catch('Unknown')
export type BidMeasurementType = z.infer<typeof bidMeasurementTypeSchema>

export const paymentDelayTypeSchema = z
  .enum(['CalendarDays', 'WorkDays', 'Unknown'])
  .catch('Unknown')
export type PaymentDelayType = z.infer<typeof paymentDelayTypeSchema>

export const operationTypeSchema = z
  .enum(['Loading', 'Unloading', 'Unknown'])
  .catch('Unknown')
export type OperationType = z.infer<typeof operationTypeSchema>
