import type { UUID } from '@chappy/shared';
import { useChannelsStore, type ChannelMsgStoreData } from '../stores/channelsStore.ts';
import { useConversationStore } from '../stores/conversationStore.ts';

export function clearAllAuthData() {
  useConversationStore.setState({
    conversationMetaData: new Map(),
    conversationMsgData: new Map()
  })

  const channels = useChannelsStore.getState().activeChannels

  const lockedChannels = new Set<UUID>()
  channels.forEach(chan => {
    if (chan.authRequired) {
      lockedChannels.add(chan.channelId)
    }
  })

  useChannelsStore.setState(s => {
    const newChannelMsgData = new Map<UUID, ChannelMsgStoreData>()

    for (const [key, entry] of s.channelMsgData) {
      if (lockedChannels.has(key)) continue

      newChannelMsgData.set(key, entry)
    }
    return {
      channelMsgData: newChannelMsgData
    }
  })
}