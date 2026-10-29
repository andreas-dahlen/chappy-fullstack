import { channelArraySchema } from '@chappy/shared'
import type { ChannelReturn } from '../types/apiData.types.ts'
import { getHttpErrorMessage } from '../utils/getErrorMsg.ts'

export async function dbGetChannels(): Promise<ChannelReturn> {

  try {
    const response = await fetch(`/api/channels`)

    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status)
      }
    }

    const rawData: unknown = await response.json()
    const channels = channelArraySchema.safeParse(rawData)

    if (!channels.success) {
      console.error('Invalid channels response:', channels.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.'
      }
    }
    return {
      state: 'success',
      channels: channels.data
    }

  } catch (error) {
    console.error('Failed to fetch channels:', error)

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