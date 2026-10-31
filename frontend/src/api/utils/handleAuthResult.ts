import { useCredentialStore } from '../../stores/credentialStore.ts'

export function handleAuthResult(
  status: number,
  requestToken: string | undefined
) {
  const store = useCredentialStore.getState()

  if (status === 401 && requestToken && store.token === requestToken) {
    store.signOut()
  }
}