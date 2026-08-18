import { ApiRequestError, parseApiError } from './problem'

/**
 * Абсолютный базовый URL. Реального бэкенда нет — все запросы обслуживает MSW.
 * Абсолютный (не относительный) адрес нужен, чтобы `fetch` работал и в браузере,
 * и в Node-тестах (Node fetch не принимает относительные пути).
 */
export const API_BASE_URL = 'https://auctions.mock/api'

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

/**
 * Базовый JSON-fetch. Возвращает распарсенное тело (`unknown` — валидация
 * ответа Zod-схемой выполняется в функциях эндпоинтов). При не-2xx бросает
 * `ApiRequestError` с типизированной ошибкой (`ProblemDetail`/`ValidationProblem`).
 */
export async function apiFetch(
  path: string,
  options: RequestOptions = {},
): Promise<unknown> {
  const { method = 'GET', body, signal } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  const text = await response.text()
  const data = text ? safeJsonParse(text) : undefined

  if (!response.ok) {
    throw new ApiRequestError(parseApiError(response.status, data))
  }

  return data
}
