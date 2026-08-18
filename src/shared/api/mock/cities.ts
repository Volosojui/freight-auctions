/** Детерминированный словарь городов для фильтров load_city/unload_city. */
export interface City {
  name: string
  gc_id: number
}

export const CITIES: City[] = [
  { name: 'Москва', gc_id: 100 },
  { name: 'Санкт-Петербург', gc_id: 78 },
  { name: 'Пермь', gc_id: 59 },
  { name: 'Екатеринбург', gc_id: 66 },
  { name: 'Новосибирск', gc_id: 54 },
  { name: 'Казань', gc_id: 16 },
  { name: 'Нижний Новгород', gc_id: 52 },
  { name: 'Краснодар', gc_id: 23 },
]

const BY_NAME = new Map(CITIES.map((c) => [c.name, c]))

export function cityByName(name: string): City {
  const city = BY_NAME.get(name)
  if (!city) throw new Error(`Unknown seed city: ${name}`)
  return city
}
