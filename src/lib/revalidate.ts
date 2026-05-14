import { revalidatePath } from 'next/cache'

import 'server-only'

export const revalidatePaths = (...paths: string[]) => {
  paths.forEach((path) => revalidatePath(path))
}
