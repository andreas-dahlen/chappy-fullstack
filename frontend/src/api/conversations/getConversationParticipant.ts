import { participantSchema, type UUID } from '@chappy/shared';
import type { ConversationParticipantReturn } from '../../types/apiData.types.ts';
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';


export async function dbGetConversationParticipant(conversationId: UUID, token: string): Promise<ConversationParticipantReturn> {
  let status: number | null = null

  try {

    const response = await fetch(`/api/conversations/${conversationId}`, {
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
    const parsedParticipantId = participantSchema.safeParse(rawData)

    if (!parsedParticipantId.success) {
      console.error('Invalid conversation response:', parsedParticipantId.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      participantId: parsedParticipantId.data.participantId
    }

  } catch (error) {
    console.error('Failed to retrieve participantId:', error)

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