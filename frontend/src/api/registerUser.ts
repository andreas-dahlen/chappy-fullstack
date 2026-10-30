import { authResponseSchema, type Credentials } from '@chappy/shared'
import type { JwtReturn } from '../types/apiData.types.ts'
import { getHttpErrorMessage } from '../utils/getErrorMsg.ts'

export async function dbRegisterUser(cred: Credentials): Promise<JwtReturn> {

  try {
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(cred)
    })

    console.log(response.status, response.url)
    console.log(response.headers.get('content-type'))

    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status)
      }
    }

    const rawData: unknown = await response.json()
    const result = authResponseSchema.safeParse(rawData)

    if (!result.success) {
      console.error('Invalid register response:', result.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.'
      }
    }
    return {
      state: 'success',
      token: result.data.jwt,
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
      message
    }
  }
}