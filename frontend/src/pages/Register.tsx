import { useState } from 'react'
import '../styles/pages/form.css'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { Loader } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { usePostAuthNavigation } from '../hooks/sideEffects/usePostAuthNavigation.ts'
import { useAuthentication } from '../hooks/user/useAuthentication.ts'

type Registration = {
  name: string
  username: string
  password: string
  confirmPassword: string
}
export default function Register() {

  const [input, setInput] = useState<Registration>(
    {
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  )

  const { registerUser } = useAuthentication()
  const loading = useCredentialStore(s => s.loading)
  const error = useCredentialStore(s => s.error)

  const location = useLocation()

  const navigateAfterAuth = usePostAuthNavigation()

  const handleRegistration = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const success = await registerUser(input)
    if (!success) return

    navigateAfterAuth()
  }


  return (
    <div className='form-box'>
      <form className='form'
        onSubmit={handleRegistration}
      >

        <label htmlFor="displayName">Display name *</label>
        <input
          id="displayName"
          type="text"
          required
          value={input.name}
          disabled={loading}
          onChange={e => setInput(prev => ({ ...prev, name: e.target.value }))}
          autoComplete='name'
        />
        <label htmlFor="username">Username *</label>
        <input
          id="username"
          type="text"
          required
          value={input.username}
          disabled={loading}
          onChange={e => setInput(prev => ({ ...prev, username: e.target.value }))}
          autoComplete='username'
        />

        <label htmlFor="password">Password *</label>
        <input
          id="password"
          type="password"
          required
          value={input.password}
          disabled={loading}
          onChange={e => setInput(prev => ({ ...prev, password: e.target.value }))}
          autoComplete='new-password'
        />
        <label htmlFor="confirmPassword">Confirm password *</label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={input.confirmPassword}
          disabled={loading}
          onChange={e => setInput(prev => ({ ...prev, confirmPassword: e.target.value }))}
          autoComplete='new-password'
        />
        <div className='state-display'>
          {loading
            ? <span role="status" aria-label="Register">
              <Loader className="loader" aria-hidden="true" />
            </span>
            : error && <p role="alert">{error}</p>
          }
        </div>
        <button type="submit"
          disabled={loading}
          className='submit-button'>
          {loading ? 'Loading...' : 'Register'}
        </button>
        <p>
          Already have an account?
          <NavLink to="/sign-in" state={location.state}>
            Sign in!
          </NavLink>
        </p>
      </form>
    </div>
  )
}