import { useChannelsStore } from '../../stores/channelsStore.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'
import type { SummaryIdType } from './useAiSummary.ts'

export function getMessages({ id, type }: SummaryIdType) {
  if (type === 'channel') {
    return useChannelsStore.getState().channelMsgData.get(id)?.messageData
  }

  return useConversationStore.getState().conversationMsgData.get(id)?.messageData
}