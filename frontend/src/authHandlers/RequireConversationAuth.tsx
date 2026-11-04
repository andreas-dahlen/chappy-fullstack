import { Navigate, Outlet } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'

export default function RequireConversationAuth() {
  const token = useCredentialStore(s => s.token)
  const signOutReason = useCredentialStore(s => s.signOutReason)

  if (!token && signOutReason) return null

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}