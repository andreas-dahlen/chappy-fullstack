import { Navigate, Outlet, useLocation } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'

export default function RequireAuth() {
  const token = useCredentialStore(s => s.token)
  const location = useLocation()

  if (!token) {
    return (
      <Navigate
        to="/sign-in"
        state={{
          reason: 'return-to',
          pathname: location.pathname
        }}
        replace
      />
    )
  }

  return <Outlet />
}