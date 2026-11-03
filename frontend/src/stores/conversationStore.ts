import type { MessageData, UUID } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ConversationMsgStoreData = {
  messageData: Map<UUID, MessageData>
  hasFetchedMsgs: boolean
  loading: boolean
  error: string | null
}

export type ConversationMetaData = {
  participantId: UUID
  participantName: string
}

export type ConversationStoreMetaData = {
  metaData: ConversationMetaData | undefined
  hasFetchedMeta: boolean
  loading: boolean
  error: string | null
}

type ConversationStore = {

  conversationMetaData: Map<UUID, ConversationStoreMetaData>
  setConversationMetaData: (
    conversationId: UUID,
    data: Partial<ConversationStoreMetaData>
  ) => void

  conversationMsgData: Map<UUID, ConversationMsgStoreData>
  setConversationMsgData: (
    conversationId: UUID,
    data: Partial<ConversationMsgStoreData>
  ) => void
  setConversationMsg: (conversationId: UUID, message: MessageData) => void
}

export const useConversationStore = create<ConversationStore>()(
  immer(set => ({

    conversationMetaData: new Map(),

    setConversationMetaData: (conversationId, data) => {
      set(s => {
        const existing = s.conversationMetaData.get(conversationId)

        s.conversationMetaData.set(conversationId, {
          hasFetchedMeta: false,
          metaData: undefined,
          loading: false,
          error: null,
          ...existing,
          ...data
        })
      })
    },

    conversationMsgData: new Map(),

    setConversationMsgData: (conversationId, data) => {
      set(s => {
        const existing = s.conversationMsgData.get(conversationId)

        s.conversationMsgData.set(conversationId, {
          hasFetchedMsgs: false,
          messageData: new Map,
          loading: false,
          error: null,
          ...existing,
          ...data
        })
      })
    },

    setConversationMsg: (conversationId, conversationMsg) => {
      set(s => {
        const existing = s.conversationMsgData.get(conversationId)

        if (!existing) return

        existing.messageData.set(conversationMsg.messageId, conversationMsg)
      })
    }
  }))
)