import { resAiArraySchema, type UUID } from '@chappy/shared';
import type { AiMessageReturn } from '../../types/apiData.types.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts';

export async function dbPostAiMessage(aiId: UUID, message: string, token: string): Promise<AiMessageReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/ai/chat/${aiId}/messages`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
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
    const messageData = resAiArraySchema.safeParse(rawData)

    if (!messageData.success) {
      console.error('Invalid message post:', messageData.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      data: messageData.data
    }

  } catch (error) {
    console.error('Failed to post message:', error)

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