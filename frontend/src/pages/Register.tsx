import { useState } from 'react'
import '../styles/pages/signIn.css'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { Loader } from 'lucide-react'
import { NavLink } from 'react-router'
import { usePostAuthNavigation } from '../hooks/usePostAuthNavigation.ts'

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

  const registerUser = useCredentialStore(s => s.registerUser)
  const loading = useCredentialStore(s => s.loading)
  const error = useCredentialStore(s => s.error)

  const navigateAfterAuth = usePostAuthNavigation()

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const success = await registerUser(input)
    if (!success) return

    navigateAfterAuth()
  }


  return (
    <form className='form'
      onSubmit={handleSignIn}
    >

      <label htmlFor="displayName">Display Name *</label>
      <input
        id="displayName"
        type="text"
        required
        value={input.name}
        onChange={e => setInput(prev => ({ ...prev, name: e.target.value }))}
      // placeholder="Username"
      />
      <label htmlFor="username">Username *</label>
      <input
        id="username"
        type="text"
        required
        value={input.username}
        onChange={e => setInput(prev => ({ ...prev, username: e.target.value }))}
      // placeholder="Username"
      />

      <label htmlFor="password">Password *</label>
      <input
        id="password"
        type="password"
        required
        value={input.password}
        onChange={e => setInput(prev => ({ ...prev, password: e.target.value }))}
      // placeholder="Password"
      />
      <label htmlFor="confirmPassword">Confirm password *</label>
      <input
        id="confirmPassword"
        type="password"
        required
        value={input.confirmPassword}
        onChange={e => setInput(prev => ({ ...prev, confirmPassword: e.target.value }))}
      // placeholder="Password"
      />

      {loading
        ? <span role="status" aria-label="Register">
          <Loader className="loader" />
        </span>
        : error && <p role="alert">{error}</p>
      }
      <button type="submit" disabled={loading} className='submit-button'>Register</button>
      <p>
        Don't have an account?
        <NavLink to="/register" className="register-nav"> Create one!</NavLink>
      </p>
    </form>
  )
}