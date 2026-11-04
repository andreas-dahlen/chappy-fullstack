import { conversationSchema, type UUID } from '@chappy/shared';
import type { ConversationStarterReturn } from '../../types/apiData.types.ts';
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';


export async function dbCreateOrGetConversation(participantId: UUID, token: string): Promise<ConversationStarterReturn> {
  let status: number | null = null

  try {

    const response = await fetch(`/api/conversations/${participantId}`, {
      method: "POST",
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

    const rawData: unknown = await response.json()
    const parsedConversationId = conversationSchema.safeParse(rawData)

    if (!parsedConversationId.success) {
      console.error('Invalid conversation response:', parsedConversationId.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      conversationId: parsedConversationId.data.conversationId
    }

  } catch (error) {
    console.error('Failed to retrieve conversationId:', error)

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