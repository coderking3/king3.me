import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: '' // 使用相对路径，客户端自动指向当前域名
})

export const { signIn, signUp, signOut, useSession } = authClient
