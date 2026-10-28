import { userArraySchema } from '@chappy/shared'
import type { UserReturn } from '../types/apiData.types.ts'

export async function dbGetUsers(): Promise<UserReturn> {

  try {
    const response = await fetch(`/api/users`)
    console.log(response.status, response.url)
    const rawData: unknown = await response.json()
    const users = userArraySchema.safeParse(rawData)

    if (users.success) return { state: 'success', users: users.data }

    return {
      state: 'failed',
      message: users.error.message
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    return {
      state: 'failed',
      message
    }
  }
}