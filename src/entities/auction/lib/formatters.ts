// Formatting helpers for auction display values. Output strings are Russian
// (ru-RU locale, ₽); pure functions, unit-tested.

const DASH = '—'

// 0-fraction currency for compact list prices.
const priceFmt = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

// 2-fraction currency for precise detail prices.
const moneyFmt = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
})

const numberFmt = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
})

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Compact currency (no kopecks); dash for null/undefined. */
export function formatPrice(value: number | null | undefined): string {
  if (value == null) return DASH
  return priceFmt.format(value)
}

/** Precise currency; null for null/undefined so callers can render conditionally. */
export function formatMoney(value: number | null | undefined): string | null {
  if (value == null) return null
  return moneyFmt.format(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return DASH
  return numberFmt.format(value)
}

export function formatPricePerKm(value: number | null | undefined): string {
  if (value == null) return DASH
  return `${moneyFmt.format(value)}/км`
}

export function formatWeightVolume(
  weight: number | null | undefined,
  volume: number | null | undefined,
): string {
  const parts: string[] = []
  if (weight != null) parts.push(`${numberFmt.format(weight)} т`)
  if (volume != null) parts.push(`${numberFmt.format(volume)} м³`)
  return parts.length ? parts.join(' · ') : DASH
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return DASH
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return DASH
  return dateFmt.format(date)
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return DASH
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return DASH
  return dateTimeFmt.format(date)
}
