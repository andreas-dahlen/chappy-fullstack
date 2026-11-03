import { channelMsgArraySchema, type UUID } from '@chappy/shared'
import type { MsgReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleAuthResult } from '../utils/handleAuthResult.ts'

export async function dbGetChannelMessages(channelId: UUID, token: string | null): Promise<MsgReturn> {
  let status: number | null = null

  try {

    const response = await fetch(`/api/channels/${channelId}/messages`,
      token
        ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        : undefined
    )


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
    const messages = channelMsgArraySchema.safeParse(rawData)

    if (!messages.success) {
      console.error('Invalid channel messages response:', messages.error)

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
    console.error('Failed to fetch channel messages:', error)

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