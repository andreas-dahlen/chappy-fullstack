import { resAiArraySchema, type UUID } from '@chappy/shared'
import type { AiMessageReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts'

export async function dbGetAiMessages(aiId: UUID, token: string): Promise<AiMessageReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/ai/chat/${aiId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    status = response.status
    handleApiAuthResult(status, token)
    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status),
        status
      }
    }

    const rawData: unknown = await response.json()
    const aiMessageData = resAiArraySchema.safeParse(rawData)

    if (!aiMessageData.success) {
      console.error('Invalid ai message response:', aiMessageData.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      data: aiMessageData.data
    }

  } catch (error) {
    console.error('Failed to fetch ai messages data:', error)

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