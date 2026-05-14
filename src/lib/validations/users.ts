import { z } from 'zod/v4'

import { idSchema, optionalUrlSchema } from './common'

export const banUserSchema = z.object({
  userId: idSchema,
  reason: z.string().optional()
})

export const setUserRoleSchema = z.object({
  userId: idSchema,
  role: z.union([
    z.literal('user'),
    z.literal('admin'),
    z.array(z.enum(['user', 'admin']))
  ])
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: optionalUrlSchema
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
