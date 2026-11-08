import { resAiMetaArraySchema } from '@chappy/shared'
import type { AiMetaDataReturn } from '../../types/apiData.types.ts'
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts'
import { handleApiAuthResult } from '../../authHandlers/handleApiAuthResult.ts'

export async function dbGetAiMetaData(token: string): Promise<AiMetaDataReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/ai/chat`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    const aiMetaData = resAiMetaArraySchema.safeParse(rawData)

    if (!aiMetaData.success) {
      console.error('Invalid AiMeta response:', aiMetaData.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      data: aiMetaData.data
    }

  } catch (error) {
    console.error('Failed to fetch aiMeta data:', error)

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