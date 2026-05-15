import { z } from 'zod/v4'

import { httpUrlSchema, nameSchema } from './common'

const SONG_SCHEMA_CONFIG = {
  name: nameSchema,
  cover: httpUrlSchema,
  url: httpUrlSchema,
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{2}:\d{2}$|^$/, 'Format: MM:SS or HH:MM:SS')
}

export const songSchema = z.object({
  ...SONG_SCHEMA_CONFIG,
  author: z.array(z.string().min(1)).min(1, 'Artist is required')
})

export type SongInput = z.infer<typeof songSchema>

export const songFormSchema = z.object({
  ...SONG_SCHEMA_CONFIG,
  author: z.string().min(1, 'Artist is required')
})

export type SongFormInput = z.infer<typeof songFormSchema>
