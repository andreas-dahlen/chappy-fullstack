import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'

export function useSignOutNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const signOutReason = useCredentialStore(s => s.signOutReason)
  const setSignOutReason = useCredentialStore(s => s.setSignOutReason)

  useEffect(() => {
    if (!signOutReason) return

    switch (signOutReason) {
      case 'manual':
        navigate('/', { replace: true })
        break

      case 'invalid':
        navigate('/sign-in', {
          replace: true,
          state: {
            reason: 'return-to',
            pathname: location.pathname
          }
        })
        break
    }

    setSignOutReason(null)
  }, [signOutReason, navigate, location.pathname, setSignOutReason])
}