import { channelMsgSchema, type UUID } from '@chappy/shared'
import type { MsgPostReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts'

export async function dbPostChannelMessage(channelId: UUID, message: string, token: string | null): Promise<MsgPostReturn> {
  let status: number | null = null

  try {

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }

    const response = await fetch(`/api/channels/${channelId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message })
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
    const parsedMsg = channelMsgSchema.safeParse(rawData)

    if (!parsedMsg.success) {
      console.error('Invalid channel message response:', parsedMsg.error)

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
    console.error('Failed to post channel messages:', error)

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