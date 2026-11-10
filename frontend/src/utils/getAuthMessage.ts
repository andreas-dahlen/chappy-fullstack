import type { AuthNavigationState } from '../types/apiData.types.ts'

export const getAuthMessage = (state: AuthNavigationState | null) => {
  if (!state) return null

  switch (state.reason) {
    case 'enter-channel':
      return 'Sign in to enter this channel.'

    case 'start-conversation':
      return 'Sign in to start a conversation.'

    case 'return-to':
      return 'Sign in to continue.'

    default:
      return null
  }
}