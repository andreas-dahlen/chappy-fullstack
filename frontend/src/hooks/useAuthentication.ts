import type { Credentials, RegCredentials } from '@chappy/shared'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { dbRegisterUser } from '../api/registerUser.ts'
import type { AuthReturn } from '../types/apiData.types.ts'
import { dbSignInUser } from '../api/signInUser.ts'

type InputCredentials = RegCredentials & {
  confirmPassword: string
}

export function useAuthentication() {
  const setCredentials = useCredentialStore(s => s.setCredentials)
  const setLoading = useCredentialStore(s => s.setLoading)
  const setError = useCredentialStore(s => s.setError)

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

    const { confirmPassword, ...data } = cred
    return authenticate(() => dbRegisterUser(data))
  }

  const signIn = (cred: Credentials) =>
    authenticate(() => dbSignInUser(cred))

  return { registerUser, signIn }
}