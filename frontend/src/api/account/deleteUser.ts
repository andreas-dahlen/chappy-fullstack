import type { ApiFailure, ApiSuccess } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts'

export async function dbDeleteUser(token: string): Promise<ApiFailure | ApiSuccess> {
  let status: number | null = null
  try {
    const response = await fetch('/api/users', {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })


    status = response.status
    handleApiAuthResult(status, token)

    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(status),
        status
      }
    }

    return { state: 'success' }

  } catch (error) {
    console.error('Failed to delete user data:', error)
    return {
      state: 'failed',
      message: 'Unable to connect to the server. Please try again.',
      status
    }
  }
}