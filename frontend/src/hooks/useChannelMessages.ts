import type { UUID } from '@chappy/shared'
import { dbGetChannelMessages } from '../api/getChannelMessages.ts'
import { useChannelsStore } from '../stores/channelsStore.ts'
import { useCredentialStore } from '../stores/credentialStore.ts'

export function useChannelMessages() {
  const token = useCredentialStore(s => s.token)

  const channels = useChannelsStore(s => s.activeChannels)
  const channelMsgData = useChannelsStore(s => s.channelMsgData)
  const setChannelMsgData = useChannelsStore(s => s.setChannelMsgData)

  const fetchChannelMessages = async (channelId: UUID) => {

    const channel = channels.find(c => c.channelId === channelId)

    if (!channel) return

    const msgData = channelMsgData.get(channelId)

    if (msgData?.hasFetchedMsgs || msgData?.loading) return
    if (channel.authRequired && !token) return

    setChannelMsgData(channelId, {
      loading: true,
      error: null
    })

    try {
      const result = await dbGetChannelMessages(channelId, token ?? null)

      if (result.state === 'failed') {
        setChannelMsgData(channelId, { error: result.message })
        return
      }

      setChannelMsgData(channelId, {
        messageData: result.ChannelMsgData,
        hasFetchedMsgs: true
      })
    } catch (error) {
      setChannelMsgData(channelId, {
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setChannelMsgData(channelId, { loading: false })
    }
  }

  return { fetchChannelMessages }
}