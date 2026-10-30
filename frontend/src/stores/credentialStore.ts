import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { AuthSuccess } from '../types/apiData.types.ts'

type CredentialStore = {
  name: string | undefined
  token: string | undefined
  userId: string | undefined
  loading: boolean
  error: string | null
  setCredentials: (credentials: AuthSuccess) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signOut: () => void
}

export const useCredentialStore = create<CredentialStore>()(
  immer((set) => ({
    name: undefined,
    token: undefined,
    userId: undefined,
    loading: false,
    error: null,

    setCredentials: credentials => {
      set(s => {
        s.name = credentials.name
        s.token = credentials.token
        s.userId = credentials.userId
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

    signOut: () => {
      set(s => {
        s.name = undefined
        s.token = undefined
        s.userId = undefined
        s.error = null
      })
    }
  }))
)