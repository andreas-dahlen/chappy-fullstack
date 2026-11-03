import { useCallback } from 'react'
import type { MessageData, UUID } from '@chappy/shared'
import { useChannelsStore } from '../stores/channelsStore.ts'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { dbGetChannelMessages } from '../api/channels/getChannelMessages.ts'

export function useChannelMessages() {
  const token = useCredentialStore(s => s.token)
  const setChannelMsgData = useChannelsStore(s => s.setChannelMsgData)

  const fetchChannelMessages = useCallback(async (channelId: UUID) => {
    const { activeChannels, channelMsgData } = useChannelsStore.getState()

    const channel = activeChannels.find(c => c.channelId === channelId)
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

      const messageData = new Map<UUID, MessageData>()

      result.msgData.forEach(message => {
        messageData.set(message.messageId, message)
      })

      setChannelMsgData(channelId, {
        messageData: messageData,
        hasFetchedMsgs: true
      })
    } catch (error) {
      setChannelMsgData(channelId, {
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setChannelMsgData(channelId, { loading: false })
    }

  }, [token, setChannelMsgData])

  return { fetchChannelMessages }
}
