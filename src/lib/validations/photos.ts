import { z } from 'zod/v4'

import { httpUrlSchema, nameSchema } from './common'

export const photoSchema = z.object({
  name: nameSchema,
  url: httpUrlSchema,
  width: z.coerce.number().int().positive('Width must be positive'),
  height: z.coerce.number().int().positive('Height must be positive'),
  date: z.coerce.date()
})

export type PhotoInput = z.infer<typeof photoSchema>
