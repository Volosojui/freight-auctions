import { describe, expect, it } from 'vitest'
import { parseApiError } from './problem'

describe('parseApiError', () => {
  it('распознаёт ValidationProblem (422) с errors[]', () => {
    const result = parseApiError(422, {
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля.',
      errors: [{ field: 'price', message: 'Значение должно быть > 0' }],
    })
    expect(result.kind).toBe('validation')
    if (result.kind === 'validation') {
      expect(result.problem.errors[0]?.field).toBe('price')
    }
  })

  it('распознаёт ProblemDetail без errors[]', () => {
    const result = parseApiError(404, {
      code: 'resource_not_found',
      title: 'Не найдено',
      message: 'Заявка не найдена',
    })
    expect(result.kind).toBe('problem')
    if (result.kind === 'problem') {
      expect(result.problem.code).toBe('resource_not_found')
    }
  })

  it('unknown для нераспознанного тела', () => {
    const result = parseApiError(500, 'oops')
    expect(result.kind).toBe('unknown')
  })
})
