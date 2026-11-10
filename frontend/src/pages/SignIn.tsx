import { useState } from 'react'
import '../styles/pages/form.css'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { Loader } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { usePostAuthNavigation } from '../hooks/sideEffects/usePostAuthNavigation.ts'
import { useAuthentication } from '../hooks/user/useAuthentication.ts'
import type { AuthNavigationState } from '../types/apiData.types.ts'
import { getAuthMessage } from '../utils/getAuthMessage.ts'

type SignIn = {
  username: string
  password: string
}

export default function SignIn() {

  const [input, setInput] = useState<SignIn>({ username: '', password: '' })

  const { signIn } = useAuthentication()
  const loading = useCredentialStore(s => s.loading)
  const error = useCredentialStore(s => s.error)

  const location = useLocation()

  const navigateAfterAuth = usePostAuthNavigation()
  const state = location.state as AuthNavigationState | null
  const authMessage = getAuthMessage(state)

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const success = await signIn(input)
    if (!success) return

    await navigateAfterAuth()
  }


  return (
    <div className='form-box'>
      <div className='auth-message'>
        <p>{authMessage}</p>
      </div>

      <form className='form'
        onSubmit={handleSignIn}
      >

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          value={input.username}
          onChange={e => setInput(prev => ({ ...prev, username: e.target.value }))}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={input.password}
          onChange={e => setInput(prev => ({ ...prev, password: e.target.value }))}
        />
        <div className='state-display'>
          {loading
            ? <span role="status" aria-label="Signing in">
              <Loader className="loader" aria-hidden="true" />
            </span>
            : error && <p role="alert">{error}</p>
          }
        </div>

        <button type="submit"
          disabled={loading}
          className='submit-button'>
          {loading ? 'Loading...' : 'Sign in'}
        </button>
        <p>
          Don't have an account?
          <NavLink
            to="/register"
            className="register-nav"
            state={state}
          > Create one!</NavLink>
        </p>
      </form>
    </div>
  )
}