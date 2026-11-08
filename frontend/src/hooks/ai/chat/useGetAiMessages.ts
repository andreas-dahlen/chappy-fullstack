import { useCallback } from 'react'
import type { AiMessage, UUID } from '@chappy/shared'
import { useAiStore } from '../../../stores/aiStore.ts'
import { dbGetAiMessages } from '../../../api/ai/getAiMessages.ts'
export function useGetAiMessages() {
  const setAiMessageData = useAiStore(s => s.setAiMessageData)
  const getAiMessages = useCallback(async (aiId: UUID, token: string) => {

    const msgData = useAiStore.getState().aiMessageData

    const existing = msgData.get(aiId)

    if (existing?.hasFetchedMsgs || existing?.loading || !token) {
      return
    }

    setAiMessageData(aiId, {
      loading: true,
      error: null
    })

    try {
      const result = await dbGetAiMessages(aiId, token)

      if (result.state === 'failed') {
        setAiMessageData(aiId, { error: result.message })
        return
      }
      const messageData = new Map<UUID, AiMessage>()

      result.data.forEach(message => {
        messageData.set(message.messageId, message)
      })

      setAiMessageData(aiId, {
        messageData: messageData,
        hasFetchedMsgs: true
      })

    } catch (error) {
      setAiMessageData(aiId, {
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setAiMessageData(aiId, { loading: false })
    }

  }, [setAiMessageData])

  return { getAiMessages }
}
