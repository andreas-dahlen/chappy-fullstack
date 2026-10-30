import { userArraySchema } from '@chappy/shared'
import type { UserReturn } from '../types/apiData.types.ts'
import { getHttpErrorMessage } from '../utils/getErrorMsg.ts'

export async function dbGetUsers(): Promise<UserReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/users`)
    status = response.status
    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status),
        status
      }
    }

    const rawData: unknown = await response.json()
    const users = userArraySchema.safeParse(rawData)

    if (!users.success) {
      console.error('Invalid users response:', users.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      users: users.data
    }

  } catch (error) {
    console.error('Failed to fetch users:', error)

    const message =
      error instanceof SyntaxError
        ? 'The server returned invalid data.'
        : 'Unable to connect to the server. Please try again.'

    return {
      state: 'failed',
      message,
      status
    }
  }
}