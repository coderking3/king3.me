import { z } from 'zod/v4'

export const poemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content is too long'),
  date: z.coerce.date()
})

export type PoemInput = z.infer<typeof poemSchema>
