import { useLocation, useNavigate } from 'react-router'
import type { AuthNavigationState } from '../types/apiData.types.ts'

export function usePostAuthNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const navigateAfterAuth = () => {
    const state = location.state as AuthNavigationState | null

    if (!state) {
      navigate('/home')
      return
    }

    switch (state.reason) {
      case 'enter-channel':
        navigate(`/channels/${state.channelId}`)
        break

      case 'start-conversation':
        // TODO: Retrieve/create conversation using state.userId
        // Then navigate to the conversation.
        break
    }
  }

  return navigateAfterAuth
}