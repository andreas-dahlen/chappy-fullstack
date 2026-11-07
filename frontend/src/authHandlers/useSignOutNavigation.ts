import { useEffect, useRef } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { useConversationStore } from '../stores/conversationStore.ts'
import { clearAllAuthData } from './clearAllAuthData.ts'

export function useSignOutNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const signOutReason = useCredentialStore(s => s.signOutReason)
  const clearSignOutReason = useCredentialStore(s => s.clearSignOutReason)
  const metaData = useConversationStore(s => s.conversationMetaData)
  const navigationProcessed = useRef(false)

  useEffect(() => {
    if (!signOutReason || navigationProcessed.current) return

    navigationProcessed.current = true

    if (signOutReason === 'manual') {
      navigate('/', { replace: true })
    }

    if (signOutReason === 'invalid') {
      const conversationMatch = matchPath(
        '/conversations/:conversationId',
        location.pathname
      )

      const conversationId = conversationMatch?.params.conversationId
      const participantId = conversationId
        ? metaData.get(conversationId)?.metaData?.participantId
        : undefined

      if (participantId) {
        navigate('/sign-in', {
          replace: true,
          state: {
            reason: 'start-conversation',
            participantId
          }
        })
      } else {
        navigate('/sign-in', {
          replace: true,
          state: {
            reason: 'return-to',
            pathname: location.pathname
          }
        })
      }
    }

    clearAllAuthData()
  }, [signOutReason, navigate, location.pathname, metaData])


  useEffect(() => {
    if (!navigationProcessed.current) return
    if (matchPath('/conversations/:conversationId', location.pathname)) return

    clearSignOutReason()
    navigationProcessed.current = false
  }, [location.pathname, clearSignOutReason])
}