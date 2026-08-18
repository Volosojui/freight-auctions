import { z } from 'zod'

/** Признаки способов загрузки — общий shape для списка и детальной. */
export const loadingTypesSchema = z.object({
  side: z.boolean(),
  top: z.boolean(),
  rear: z.boolean(),
  full: z.boolean(),
})
export type LoadingTypes = z.infer<typeof loadingTypesSchema>

/** Требуемые документы — общий shape для списка и детальной. */
export const docsSchema = z.object({
  tir: z.boolean(),
  cmr: z.boolean(),
  t1: z.boolean(),
  med: z.boolean(),
})
export type Docs = z.infer<typeof docsSchema>
