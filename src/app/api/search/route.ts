// export function GET() {}

import { getSearchData } from '@/data/search'
import { failure, success } from '@/lib/result'

export async function GET() {
  try {
    const result = await getSearchData()
    return Response.json(success(result))
  } catch (error: unknown) {
    return Response.json(failure(error))
  }
}
