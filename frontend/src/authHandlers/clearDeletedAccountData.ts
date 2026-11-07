import type { UUID } from '@chappy/shared';
import { useChannelsStore } from '../stores/channelsStore.ts';
import { useAiStore } from '../stores/aiStore.ts';

export function clearDeletedAccountData(ownerId: UUID) {

  const channels = useChannelsStore.getState().channels
  const removeChannel = useChannelsStore.getState().removeChannel
  const setChannelMsgData = useChannelsStore.getState().setChannelMsgData
  const removeSummaryData = useAiStore.getState().removeSummaryData

  const ownedChannels = new Set<UUID>()

  channels.forEach(data => {
    if (data.channel.createdBy === ownerId) {
      ownedChannels.add(data.channel.channelId)
    }
  })

  for (const channel of ownedChannels) {
    removeChannel(channel)
    removeSummaryData(channel)
  } //removes both channel and channelMsgData

  const channelMsgData = useChannelsStore.getState().channelMsgData

  for (const [key, channelData] of channelMsgData) {
    const messageData = new Map(channelData.messageData)
    for (const msg of channelData.messageData.values()) {
      if (msg.createdBy === ownerId) {
        messageData.set(msg.messageId, { ...msg, createdBy: 'guest' })
      }
    }
    if (messageData.size > 0) {
      setChannelMsgData(key, { messageData })
      removeSummaryData(key)
    }
  }
}