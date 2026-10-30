import { authResponseSchema, type RegCredentials } from '@chappy/shared'
import type { AuthReturn } from '../types/apiData.types.ts'
import { getHttpErrorMessage } from '../utils/getErrorMsg.ts'

export async function dbRegisterUser(cred: RegCredentials): Promise<AuthReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(cred)
    })

    status = response.status

    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status),
        status
      }
    }

    const rawData: unknown = await response.json()
    const result = authResponseSchema.safeParse(rawData)

    if (!result.success) {
      console.error('Invalid register response:', result.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      token: result.data.token,
      userId: result.data.userId,
      name: result.data.name
    }

  } catch (error) {
    console.error('Failed to register user:', error)

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