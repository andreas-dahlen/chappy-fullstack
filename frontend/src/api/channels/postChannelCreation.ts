import { resChannelSchema, type ChannelCreationInput } from '@chappy/shared';
import type { CreatedChannelReturn } from '../../types/apiData.types.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts';

export async function dbPostChannelCreation(creation: ChannelCreationInput, token: string): Promise<CreatedChannelReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/channels`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(creation)
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
    const channel = resChannelSchema.safeParse(rawData)

    if (!channel.success) {
      console.error('Invalid channel creation:', channel.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      channel: channel.data
    }

  } catch (error) {
    console.error('Failed to create channel:', error)

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