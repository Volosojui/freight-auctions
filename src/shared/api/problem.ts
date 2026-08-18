import { z } from 'zod'

/** Единый формат бизнес/HTTP-ошибки API. */
export const problemDetailSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
})
export type ProblemDetail = z.infer<typeof problemDetailSchema>

/** Ошибка по конкретному полю запроса (422). */
export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string().nullable().optional(),
})
export type ValidationError = z.infer<typeof validationErrorSchema>

/** Ошибка валидации входных данных (422): code `validation_failed` + errors[]. */
export const validationProblemSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
  errors: z.array(validationErrorSchema),
})
export type ValidationProblem = z.infer<typeof validationProblemSchema>

/** Типизированная ошибка API: либо валидация (422), либо общая проблема. */
export type ApiError =
  | { kind: 'validation'; status: number; problem: ValidationProblem }
  | { kind: 'problem'; status: number; problem: ProblemDetail }
  | { kind: 'unknown'; status: number; body: unknown }

/**
 * Разбирает тело ответа-ошибки. `ValidationProblem` отличается наличием
 * `errors[]`; иначе пробуем `ProblemDetail`; иначе — `unknown`.
 */
export function parseApiError(status: number, body: unknown): ApiError {
  const validation = validationProblemSchema.safeParse(body)
  if (validation.success) {
    return { kind: 'validation', status, problem: validation.data }
  }
  const problem = problemDetailSchema.safeParse(body)
  if (problem.success) {
    return { kind: 'problem', status, problem: problem.data }
  }
  return { kind: 'unknown', status, body }
}

/** Ошибка, выбрасываемая транспортом при не-2xx ответе. */
export class ApiRequestError extends Error {
  readonly error: ApiError

  constructor(error: ApiError) {
    super(
      error.kind === 'unknown'
        ? `Ошибка запроса (HTTP ${error.status})`
        : error.problem.message,
    )
    this.name = 'ApiRequestError'
    this.error = error
  }

  get status(): number {
    return this.error.status
  }

  /** true для ответа 422 (ошибка валидации с полевыми ошибками). */
  get isValidation(): boolean {
    return this.error.kind === 'validation'
  }
}
