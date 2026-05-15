import { z } from 'zod/v4'

export const idSchema = z.string().min(1, 'Id is required')
export const idsSchema = z.array(idSchema).min(1, 'At least one id is required')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')

export const httpUrlSchema = z.httpUrl('Please enter a valid URL')
export const optionalHttpUrlSchema = z.union([
  z.httpUrl('Please enter a valid URL'),
  z.literal('')
])
