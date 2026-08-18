import { z } from 'zod'

export interface BetBounds {
  min?: number | null
  max?: number | null
  step?: number | null
}

export interface BetFormValues {
  price: number
}

/**
 * Builds the bid validation schema from the detail DTO bounds. Base rule:
 * price is a finite number > 0. When bounds are present it also enforces the
 * [min, max] range and step multiplicity. Step math runs in integer cents to
 * avoid floating-point drift.
 */
export function makeBetSchema({ min, max, step }: BetBounds) {
  return z.object({
    price: z
      .number({ invalid_type_error: 'Введите цену' })
      .finite('Введите цену')
      .positive('Цена должна быть больше 0')
      .superRefine((value, ctx) => {
        if (min != null && value < min) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Цена не меньше ${min}`,
          })
        }
        if (max != null && value > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Цена не больше ${max}`,
          })
        }
        if (step != null && step > 0) {
          const base = min ?? 0
          const diffCents = Math.round((value - base) * 100)
          const stepCents = Math.round(step * 100)
          if (diffCents % stepCents !== 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Цена должна быть кратна шагу ${step}`,
            })
          }
        }
      }),
  })
}

export type BetSchema = ReturnType<typeof makeBetSchema>
