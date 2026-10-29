import type { Channel } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { dbGetChannels } from '../api/getChannels.ts'

type ChannelsStore = {
  activeChannels: Channel[]
  hasFetchedChannels: boolean
  loading: boolean
  error: string | null

  fetchChannels: () => Promise<void>
}

export const useChannelsStore = create<ChannelsStore>()(
  immer((set, get) => ({
    activeChannels: [],
    hasFetchedChannels: false,
    loading: false,
    error: null,

    fetchChannels: async () => {
      if (get().hasFetchedChannels || get().loading) return

      set((s) => {
        s.loading = true
        s.error = null
      })

      try {
        const result = await dbGetChannels()

        if (result.state === 'failed') {
          set((s) => {
            s.error = result.message
          })
          return
        }

        set((s) => {
          s.activeChannels = result.channels
          s.hasFetchedChannels = true
        })
      } catch (error) {
        set((s) => {
          s.error = error instanceof Error
            ? error.message
            : String(error)
        })
      } finally {
        set((s) => {
          s.loading = false
        })
      }
    }
  }))
)
