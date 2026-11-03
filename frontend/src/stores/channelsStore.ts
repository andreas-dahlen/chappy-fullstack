import type { Channel, MessageData, UUID } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ChannelMsgStoreData = {
  hasFetchedMsgs: boolean
  messageData: Map<UUID, MessageData>
  loading: boolean
  error: string | null
}

type ChannelsStore = {
  activeChannels: Channel[]
  hasFetchedChannels: boolean
  loading: boolean
  error: string | null

  setChannels: (channels: Channel[]) => void
  setHasFetchedChannels: (hasFetched: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  channelMsgData: Map<UUID, ChannelMsgStoreData>
  setChannelMsgData: (
    channelId: UUID,
    data: Partial<ChannelMsgStoreData>
  ) => void
  setChannelMsg: (channelId: UUID, message: MessageData) => void
}

export const useChannelsStore = create<ChannelsStore>()(
  immer(set => ({
    activeChannels: [],
    hasFetchedChannels: false,
    loading: false,
    error: null,

    setChannels: channels => {
      set(s => {
        s.activeChannels = channels
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
          messageData: new Map,
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
    }
  }))
)