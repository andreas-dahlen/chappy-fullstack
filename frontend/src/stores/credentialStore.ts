import type { Credentials } from '@chappy/shared'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { dbRegisterUser } from '../api/registerUser.ts'

type CredentialStore = {
  name: string | undefined
  token: string | undefined
  userId: string | undefined
  loading: boolean
  error: string | null

  signOut: () => void

  registerUser: (cred: InputCredentials) => Promise<boolean>
}
type InputCredentials = Credentials & {
  confirmPassword: string
}

export const useCredentialStore = create<CredentialStore>()(
  immer((set, get) => ({
    name: undefined,
    token: undefined,
    userId: undefined,
    loading: false,
    error: null,

    signOut: () => {
      set(s => {
        s.name = undefined
        s.token = undefined
        s.userId = undefined
      })
    },

    registerUser: async (cred) => {
      if (get().token || get().loading) return false

      if (cred.confirmPassword !== cred.password) {
        set(s => {
          s.error = 'Passwords do not match'
        })
        return false
      }

      set((s) => {
        s.loading = true
        s.error = null
      })

      try {
        const { confirmPassword, ...data } = cred
        const result = await dbRegisterUser(data)

        if (result.state === 'failed') {
          set((s) => {
            s.error = result.message
          })
          return false
        }

        set((s) => {
          s.token = result.token
          s.userId = result.userId
          s.name = result.name
        })
        return true
      } catch (error) {
        set((s) => {
          s.error = error instanceof Error
            ? error.message
            : String(error)
        })
        return false
      } finally {
        set((s) => {
          s.loading = false
        })
      }
    }
  }))
)
