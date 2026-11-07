import type { UUID } from '@chappy/shared';
import { useChannelsStore, type ChannelMsgStoreData } from '../stores/channelsStore.ts';
import { useConversationStore } from '../stores/conversationStore.ts';
import { useAiStore } from '../stores/aiStore.ts';

export function clearAllAuthData() {
  const channels = useChannelsStore.getState().channels
  const removeSummaryData = useAiStore.getState().removeSummaryData

  const metadataKeys = useConversationStore.getState().conversationMetaData.keys()
  for (const conversationId of metadataKeys) {
    removeSummaryData(conversationId)
  }

  useConversationStore.setState({
    conversationMetaData: new Map(),
    conversationMsgData: new Map()
  })


  const lockedChannels = new Set<UUID>()
  channels.forEach(data => {
    if (data.channel.authRequired) {
      removeSummaryData(data.channel.channelId)
      lockedChannels.add(data.channel.channelId)
    }
  })

  useChannelsStore.setState(s => {
    const newChannelMsgData = new Map<UUID, ChannelMsgStoreData>()

    for (const [id, entry] of s.channelMsgData) {
      if (lockedChannels.has(id)) continue

      newChannelMsgData.set(id, entry)
    }
    return {
      channelMsgData: newChannelMsgData
    }
  })
}