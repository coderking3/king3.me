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

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  link: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  icon: z.union([z.url('Please enter a valid URL'), z.literal('')])
})

export type ProjectInput = z.infer<typeof projectSchema>

export const songSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  author: z.array(z.string().min(1)).min(1, 'Artist is required'),
  cover: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  url: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{2}:\d{2}$|^$/, 'Format: MM:SS or HH:MM:SS')
})

export type SongInput = z.infer<typeof songSchema>

export const photoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  url: z.url('Please enter a valid URL'),
  width: z.number().int().positive('Width must be positive'),
  height: z.number().int().positive('Height must be positive'),
  date: z.coerce.date()
})

export type PhotoInput = z.infer<typeof photoSchema>
