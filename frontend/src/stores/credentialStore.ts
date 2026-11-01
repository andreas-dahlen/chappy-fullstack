import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthSuccess } from '../types/apiData.types.ts'

type CredentialStore = {
  name: string | undefined
  token: string | undefined
  userId: string | undefined
  loading: boolean
  error: string | null
  signOutReason: signOutReason | null
  setCredentials: (credentials: AuthSuccess) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signOut: (reason: signOutReason) => void
  setSignOutReason: (reason: signOutReason | null) => void
}

type signOutReason = 'manual' | 'invalid'

export const useCredentialStore = create<CredentialStore>()(
  persist(
    immer(set => ({
      name: undefined,
      token: undefined,
      userId: undefined,
      loading: false,
      error: null,
      signOutReason: null,

      setCredentials: credentials => {
        set(s => {
          s.name = credentials.authData.name
          s.token = credentials.authData.token
          s.userId = credentials.authData.userId
          s.error = null
          s.signOutReason = null
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

      signOut: (reason) => {
        set(s => {
          s.name = undefined
          s.token = undefined
          s.userId = undefined
          s.loading = false
          s.error = null
          s.signOutReason = reason
        })
      },

      setSignOutReason: (reason) => {
        set(s => {
          s.signOutReason = reason
        })
      }
    })),
    {
      name: 'chappy-credentials',
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        name: state.name,
        token: state.token,
        userId: state.userId
      })
    }
  )
)