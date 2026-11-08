import { resAiMetaSchema } from '@chappy/shared';
import type { PostAiMetaDataReturn } from '../../types/apiData.types.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts';

export async function dbPostAiMetaData(name: string, token: string): Promise<PostAiMetaDataReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/ai/chat`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
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
    const metaData = resAiMetaSchema.safeParse(rawData)

    if (!metaData.success) {
      console.error('Invalid metaData post:', metaData.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      data: metaData.data
    }

  } catch (error) {
    console.error('Failed to post metaData:', error)

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