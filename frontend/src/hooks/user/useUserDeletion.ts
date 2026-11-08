import { useCredentialStore } from '../../stores/credentialStore.ts';
import { useCallback } from 'react';
import { dbDeleteUser } from '../../api/account/deleteUser.ts';
import { useUsersStore } from '../../stores/usersStore.ts';
import { clearDeletedAccountData } from '../../authHandlers/clearDeletedAccountData.ts';

export function useUserDeletion() {
  const token = useCredentialStore(s => s.token)
  const setLoading = useCredentialStore(s => s.setLoading)
  const setError = useCredentialStore(s => s.setError)
  const removeUser = useUsersStore(s => s.removeUser)
  const signOut = useCredentialStore(s => s.signOut)

  const deleteUser = useCallback(async () => {
    const { userId } = useCredentialStore.getState()
    if (useCredentialStore.getState().loading) return
    if (!userId || !token) return

    setError(null)
    setLoading(true)
    try {
      const result = await dbDeleteUser(token)

      if (result.state === 'failed') {
        setError(result.message)
        return
      }
      clearDeletedAccountData(userId)
      removeUser(userId)
      signOut('manual')

    } catch (error) {
      setError(error instanceof Error
        ? error.message
        : String(error)
      )
      return
    } finally {
      setLoading(false)
    }
  }, [token, setLoading, setError, removeUser, signOut])

  return { deleteUser }
}