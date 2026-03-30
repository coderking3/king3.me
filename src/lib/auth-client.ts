import { sentinelClient } from '@better-auth/infra/client'
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: '',
  plugins: [adminClient(), sentinelClient()]
})

export const { signIn, signUp, signOut, useSession } = authClient
