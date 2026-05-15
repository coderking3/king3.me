import { z } from 'zod/v4'

import { httpUrlSchema, nameSchema } from './common'

export const projectSchema = z.object({
  name: nameSchema,
  description: z.string().max(500, 'Description is too long'),
  link: httpUrlSchema,
  icon: httpUrlSchema
})

export type ProjectInput = z.infer<typeof projectSchema>
