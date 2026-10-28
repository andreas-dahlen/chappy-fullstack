import type { User } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { dbGetUsers } from '../api/getUsers.ts'

type UsersStore = {
  activeUsers: User[]
  hasFetchedUsers: boolean
  loading: boolean
  error: string | null

  fetchUsers: () => Promise<void>
}

export const useUsersStore = create<UsersStore>()(
  immer((set, get) => ({
    activeUsers: [],
    hasFetchedUsers: false,
    loading: false,
    error: null,

    fetchUsers: async () => {
      if (get().hasFetchedUsers || get().loading) return

      set((s) => {
        s.loading = true
        s.error = null
      })

      try {
        const result = await dbGetUsers()

        if (result.state === 'failed') {
          set((s) => {
            s.error = result.message
          })
          return
        }

        set((s) => {
          s.activeUsers = result.users
          s.hasFetchedUsers = true
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
