import type { User, UUID } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { dbGetUsers } from '../api/account/getUsers.ts'

type UsersStore = {
  users: Map<UUID, User>
  hasFetchedUsers: boolean
  loading: boolean
  error: string | null

  fetchUsers: () => Promise<void>
  removeUser: (userId: UUID) => void
}

export const useUsersStore = create<UsersStore>()(
  immer((set, get) => ({
    users: new Map(),
    hasFetchedUsers: false,
    loading: false,
    error: null,

    fetchUsers: async () => {
      if (get().hasFetchedUsers || get().loading) return

      set(s => {
        s.loading = true
        s.error = null
      })

      try {
        const result = await dbGetUsers()

        if (result.state === 'failed') {
          set(s => {
            s.error = result.message
          })
          return
        }

        set(s => {
          s.users = new Map(
            result.users.map(user => [user.userId, user])
          )
          s.hasFetchedUsers = true
        })

      } catch (error) {
        set(s => {
          s.error = error instanceof Error
            ? error.message
            : String(error)
        })
      } finally {
        set(s => {
          s.loading = false
        })
      }
    },
    removeUser: userId => {
      set(s => {
        s.users.delete(userId)
      })
    }
  }))
)
