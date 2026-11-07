import type { UUID } from '@chappy/shared';
import { useCallback } from 'react';
import { useAiStore } from '../../stores/aiStore.ts';
import { dbPostAiSummary } from '../../api/ai/postAiSummary.ts';
import { getMessages } from './getMessages.ts';
import { formatMessagesForAi } from './formatMessages.ts';
import { useCredentialStore } from '../../stores/credentialStore.ts';

export type SummaryIdType = {
  type: 'conversation' | 'channel'
  id: UUID
}

export function useAiSummary() {
  const setSummaryData = useAiStore(s => s.setSummaryData)


  const generateSummary = useCallback(async ({ id, type }: SummaryIdType, reload?: boolean) => {
    const summaries = useAiStore.getState().summaries

    const existing = summaries.get(id)

    if (!reload && existing?.summary) return
    if (existing?.loading) return

    const messages = getMessages({ id, type })
    if (!messages || messages.size === 0) {
      setSummaryData(id, { error: 'No messages to summarize' })
      return
    }

    const formattedMessages = formatMessagesForAi([...messages.values()])

    const currentUserName = useCredentialStore.getState().name ?? 'Guest'

    const prompt = `
      Conversation type: ${type === 'conversation' ? 'Private one-to-one conversation' : 'Multi-user channel'}
      Current user: ${currentUserName ?? 'Unknown (guest)'}

      Messages:
      ${formattedMessages}
      `


    setSummaryData(id, {
      loading: true,
      error: null
    })

    try {
      const result = await dbPostAiSummary({ text: prompt })

      if (result.state === 'failed') {
        setSummaryData(id, { error: result.message })
        return
      }

      setSummaryData(id, { summary: result.summary })

    } catch (error) {
      setSummaryData(id, {
        error: error instanceof Error ? error.message : String(error)
      })

    } finally {
      setSummaryData(id, { loading: false })
    }

  }, [setSummaryData])

  return { generateSummary }
}