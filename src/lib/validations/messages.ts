import { z } from 'zod/v4'

const maxLength = 600
const genMsgSchema = <T extends string>(title: T) => {
  const upperTitle = title.slice(0, 1).toLocaleUpperCase() + title.slice(1)

  return z.object({
    [title]: z
      .string()
      .min(1, `${upperTitle} is too long`)
      .max(maxLength, `${upperTitle} is too long`)
  } as { [K in T]: z.ZodString })
}

export const messageSchema = genMsgSchema('message')
export type MessageInput = z.infer<typeof messageSchema>

export const replySchema = genMsgSchema('reply')
export type ReplyInput = z.infer<typeof replySchema>
