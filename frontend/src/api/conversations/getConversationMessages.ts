import { conversationMsgArraySchema, type UUID } from '@chappy/shared'
import type { MsgReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts'

export async function dbGetConversationMessages(conversationId: UUID, token: string): Promise<MsgReturn> {
  let status: number | null = null

  try {

    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      headers: {
        'Content-Type': 'application/json',
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

    const rawData: unknown = await response.json()
    const messages = conversationMsgArraySchema.safeParse(rawData)

    if (!messages.success) {
      console.error('Invalid conversation messages response:', messages.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      msgData: messages.data
    }

  } catch (error) {
    console.error('Failed to fetch conversation messages:', error)

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