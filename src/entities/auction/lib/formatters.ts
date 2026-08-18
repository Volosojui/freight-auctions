// Display formatters. Output copy stays Russian (ru-RU locale, ₽).

const moneyFmt = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
})

const dateTimeFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** Formats a money amount, or returns null for null/undefined input. */
export function formatMoney(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null
  return moneyFmt.format(value)
}

/** Formats a "price per km" figure with the ₽/км suffix. */
export function formatPricePerKm(value: number): string {
  return `${moneyFmt.format(value)}/км`
}

/** Formats an ISO date-time string; returns the raw input if unparseable. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateTimeFmt.format(date)
}

/** Formats an ISO date string (no time); returns the raw input if unparseable. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateFmt.format(date)
}
