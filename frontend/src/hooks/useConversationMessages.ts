import { useCallback } from 'react'
import type { MessageData, UUID } from '@chappy/shared'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { useConversationStore } from '../stores/conversationStore.ts'
import { dbGetConversationMessages } from '../api/conversations/getConversationMessages.ts'

export function useConversationMessages() {
  const token = useCredentialStore(s => s.token)
  const setConversationMsgData = useConversationStore(s => s.setConversationMsgData)

  const fetchConversationMessages = useCallback(async (conversationId: UUID) => {
    const { conversationMsgData } = useConversationStore.getState()

    const msgData = conversationMsgData.get(conversationId)

    if (msgData?.hasFetchedMsgs || msgData?.loading) {
      return
    }

    if (!token) return
    setConversationMsgData(conversationId, {
      loading: true,
      error: null
    })

    try {
      const result = await dbGetConversationMessages(conversationId, token)

      if (result.state === 'failed') {
        setConversationMsgData(conversationId, { error: result.message })
        return
      }
      const messageData = new Map<UUID, MessageData>()

      result.msgData.forEach(message => {
        messageData.set(message.messageId, message)
      })

      setConversationMsgData(conversationId, {
        messageData: messageData,
        hasFetchedMsgs: true
      })

    } catch (error) {
      setConversationMsgData(conversationId, {
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setConversationMsgData(conversationId, { loading: false })
    }

  }, [token, setConversationMsgData])

  return { fetchConversationMessages }
}
