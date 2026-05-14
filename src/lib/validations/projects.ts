import { z } from 'zod/v4'

import { nameSchema, urlSchema } from './common'

export const projectSchema = z.object({
  name: nameSchema,
  description: z.string().max(500, 'Description is too long'),
  link: urlSchema,
  icon: urlSchema
})

export type ProjectInput = z.infer<typeof projectSchema>
