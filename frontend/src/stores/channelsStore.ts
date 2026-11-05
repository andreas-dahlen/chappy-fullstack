import type { Channel, MessageData, UUID } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ChannelMsgStoreData = {
  hasFetchedMsgs: boolean
  messageData: Map<UUID, MessageData>
  loading: boolean
  error: string | null
}

export type ChannelStoreData = {
  channel: Channel
  loading: boolean
  error: string | null
}

type ChannelsStore = {
  channels: Map<UUID, ChannelStoreData>
  hasFetchedChannels: boolean
  loading: boolean
  error: string | null

  setChannels: (channels: Channel[]) => void
  setChannel: (channel: Channel) => void
  setChannelData: (channelId: UUID, data: Partial<ChannelStoreData>) => void
  setHasFetchedChannels: (hasFetched: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  channelMsgData: Map<UUID, ChannelMsgStoreData>
  setChannelMsgData: (
    channelId: UUID,
    data: Partial<ChannelMsgStoreData>
  ) => void
  setChannelMsg: (channelId: UUID, message: MessageData) => void
  removeChannel: (channelId: UUID) => void
}

export const useChannelsStore = create<ChannelsStore>()(
  immer(set => ({
    channels: new Map(),
    hasFetchedChannels: false,
    loading: false,
    error: null,

    setChannels: channels => {
      set(s => {
        s.channels = new Map(
          channels.map(channel => [
            channel.channelId,
            { channel, loading: false, error: null }
          ])
        )
      })
    },

    setChannel: (channel: Channel) => {
      set(s => {
        s.channels.set(channel.channelId, {
          channel,
          loading: false,
          error: null
        })
      })
    },

    setChannelData: (channelId, data) => {
      set(s => {
        const existing = s.channels.get(channelId)
        if (!existing) return

        Object.assign(existing, data)
      })
    },

    setHasFetchedChannels: hasFetched => {
      set(s => {
        s.hasFetchedChannels = hasFetched
      })
    },

    setLoading: loading => {
      set(s => {
        s.loading = loading
      })
    },

    setError: error => {
      set(s => {
        s.error = error
      })
    },

    channelMsgData: new Map(),

    setChannelMsgData: (channelId, data) => {
      set(s => {
        const existing = s.channelMsgData.get(channelId)

        s.channelMsgData.set(channelId, {
          hasFetchedMsgs: false,
          messageData: new Map(),
          loading: false,
          error: null,
          ...existing,
          ...data
        })
      })
    },

    setChannelMsg: (channelId, channelMsg) => {
      set(s => {
        const existing = s.channelMsgData.get(channelId)

        if (!existing) return

        existing.messageData.set(channelMsg.messageId, channelMsg)
      })
    },

    removeChannel: (channelId: UUID) => {
      set(s => {
        s.channels.delete(channelId)
        s.channelMsgData.delete(channelId)
      })
    }
  }))
)