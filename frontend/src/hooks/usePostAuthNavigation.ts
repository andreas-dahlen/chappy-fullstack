import { useLocation, useNavigate } from 'react-router'
import type { AuthNavigationState } from '../types/apiData.types.ts'
import { dbCreateOrGetConversation } from '../api/conversations/createOrGetConversation.ts'
import { useCredentialStore } from '../stores/credentialStore.ts'

export function usePostAuthNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const goHome = () => navigate('/', { replace: true })

  const navigateAfterAuth = async () => {
    const state = location.state as AuthNavigationState | null

    if (!state) {
      navigate('/', { replace: true })
      return
    }

    switch (state.reason) {
      case 'return-to':
        if (isValidReturnPath(state.pathname)) {
          navigate(state.pathname, { replace: true })
        } else {
          goHome()
        }
        break

      case 'enter-channel':
        navigate(`/channels/${state.channelId}`, { replace: true })
        break

      case 'start-conversation':
        const token = useCredentialStore.getState().token
        if (!token) {
          goHome()
          return
        }
        const userId = useCredentialStore.getState().userId

        if (userId === state.participantId) {
          goHome()
          return
        }

        const data = await dbCreateOrGetConversation(state.participantId, token)

        if (data.state === 'success') {
          navigate(`/conversations/${data.conversationId}`, { replace: true })
        } else {
          goHome()
        }
        break
      default: goHome()
    }
  }

  return navigateAfterAuth
}

function isValidReturnPath(path: unknown): path is string {
  return (
    typeof path === 'string' &&
    path.startsWith('/') &&
    !path.startsWith('//')
  )
}