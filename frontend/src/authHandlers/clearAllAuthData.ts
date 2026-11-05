import type { UUID } from '@chappy/shared';
import { useChannelsStore, type ChannelMsgStoreData } from '../stores/channelsStore.ts';
import { useConversationStore } from '../stores/conversationStore.ts';

export function clearAllAuthData() {
  useConversationStore.setState({
    conversationMetaData: new Map(),
    conversationMsgData: new Map()
  })

  const channels = useChannelsStore.getState().channels

  const lockedChannels = new Set<UUID>()
  channels.forEach(data => {
    if (data.channel.authRequired) {
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