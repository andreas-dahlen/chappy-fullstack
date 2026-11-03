import { conversationMsgSchema, type UUID } from '@chappy/shared'
import type { MsgPostReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleAuthResult } from '../utils/handleAuthResult.ts'

export async function dbPostConversationMessage(conversationId: UUID, message: string, token: string): Promise<MsgPostReturn> {
  let status: number | null = null

  try {

    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })


    status = response.status
    handleAuthResult(status, token)

    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(status),
        status
      }
    }

    const rawData: unknown = await response.json()
    const parsedMsg = conversationMsgSchema.safeParse(rawData)

    if (!parsedMsg.success) {
      console.error('Invalid conversation message response:', parsedMsg.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      messageData: parsedMsg.data
    }

  } catch (error) {
    console.error('Failed to post conversation messages:', error)

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