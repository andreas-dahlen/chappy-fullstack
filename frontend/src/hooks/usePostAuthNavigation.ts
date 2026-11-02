import { useLocation, useNavigate } from 'react-router'
import type { AuthNavigationState } from '../types/apiData.types.ts'
import { dbCreateOrGetConversation } from '../api/conversations/dbCreateOrGetConversation.ts'
import { useCredentialStore } from '../stores/credentialStore.ts'

export function usePostAuthNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

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
          navigate('/', { replace: true })
        }
        break

      case 'enter-channel':
        navigate(`/channels/${state.channelId}`, { replace: true })
        break

      case 'start-conversation':
        const token = useCredentialStore.getState().token
        if (!token) {
          navigate('/', { replace: true })
          return
        }
        const data = await dbCreateOrGetConversation(state.userId, token)

        if (data.state === 'success') {
          navigate(`/conversations/${data.conversationId}`, { replace: true })
        } else {
          navigate('/', { replace: true })
        }
        break
      default: navigate('/', { replace: true })
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