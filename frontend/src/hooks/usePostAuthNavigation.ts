import { useLocation, useNavigate } from 'react-router'
import type { AuthNavigationState } from '../types/apiData.types.ts'

export function usePostAuthNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const navigateAfterAuth = () => {
    const state = location.state as AuthNavigationState | null

    if (!state) {
      navigate('/home', { replace: true })
      return
    }

    switch (state.reason) {
      case 'return-to':
        if (isValidReturnPath(state.pathname)) {
          navigate(state.pathname, { replace: true })
        } else {
          navigate('/home', { replace: true })
        }
        break

      case 'enter-channel':
        navigate(`/channels/${state.channelId}`, { replace: true })
        break

      case 'start-conversation':
        // Retrieve/create conversation, then navigate.
        break
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