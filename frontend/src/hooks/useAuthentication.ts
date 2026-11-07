import type { SignInCredentials, RegistrationCredentials } from '@chappy/shared'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { dbRegisterUser } from '../api/account/registerUser.ts'
import type { AuthReturn } from '../types/apiData.types.ts'
import { dbSignInUser } from '../api/account/signInUser.ts'
import { useUsersStore } from '../stores/usersStore.ts'

type InputCredentials = RegistrationCredentials & {
  confirmPassword: string
}

export function useAuthentication() {
  const setCredentials = useCredentialStore(s => s.setCredentials)
  const setLoading = useCredentialStore(s => s.setLoading)
  const setError = useCredentialStore(s => s.setError)
  const setUser = useUsersStore(s => s.setUser)

  const authenticate = async (
    request: () => Promise<AuthReturn>
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const result = await request()

      if (result.state === 'failed') {
        setError(result.message)
        return false
      }
      setUser({ name: result.authData.name, userId: result.authData.userId })
      setCredentials(result)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
      return false
    } finally {
      setLoading(false)
    }
  }

  const registerUser = async (cred: InputCredentials) => {
    if (cred.confirmPassword !== cred.password) {
      setError('Passwords do not match')
      return false
    }

    const { confirmPassword: _, ...data } = cred
    return authenticate(() => dbRegisterUser(data))
  }

  const signIn = (cred: SignInCredentials) =>
    authenticate(() => dbSignInUser(cred))

  return { registerUser, signIn }
}