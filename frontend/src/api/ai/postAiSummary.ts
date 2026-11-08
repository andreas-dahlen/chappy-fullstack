import { resFromAiSchema, type SummarizeInput } from '@chappy/shared';
import type { SummaryReturn } from '../../types/apiData.types.ts';
import { getHttpErrorMessage } from '../../utils/getErrorMsg.ts';

export async function dbPostAiSummary(text: SummarizeInput): Promise<SummaryReturn> {
  let status: number | null = null
  try {
    const response = await fetch(`/api/ai/summarize`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(text)
    })
    status = response.status
    if (!response.ok) {
      return {
        state: 'failed',
        message: getHttpErrorMessage(response.status),
        status
      }
    }

    const rawData: unknown = await response.json()
    const channel = resFromAiSchema.safeParse(rawData)

    if (!channel.success) {
      console.error('Invalid summary request:', channel.error)

      return {
        state: 'failed',
        message: 'Received invalid data from the server.',
        status
      }
    }
    return {
      state: 'success',
      data: channel.data
    }

  } catch (error) {
    console.error('Failed to summarize:', error)

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