// Formatting helpers for auction display values. Output strings are Russian
// (product locale); pure functions, unit-tested.

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dash = '—'

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return dash
  return priceFormatter.format(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return dash
  return numberFormatter.format(value)
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return dash
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return dash
  return dateFormatter.format(date)
}

export function formatPricePerKm(value: number | null | undefined): string {
  if (value == null) return dash
  return `${numberFormatter.format(value)} ₽/км`
}

export function formatWeightVolume(
  weight: number | null | undefined,
  volume: number | null | undefined,
): string {
  const parts: string[] = []
  if (weight != null) parts.push(`${numberFormatter.format(weight)} т`)
  if (volume != null) parts.push(`${numberFormatter.format(volume)} м³`)
  return parts.length ? parts.join(' · ') : dash
}
