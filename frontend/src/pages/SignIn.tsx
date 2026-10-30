import { useState } from 'react'
import '../styles/pages/signIn.css'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { Loader } from 'lucide-react'
import { NavLink } from 'react-router'

type SignIn = {
  username: string
  password: string
}

export default function SignIn() {

  const [input, setInput] = useState<SignIn>({ username: '', password: '' })

  const signIn = useCredentialStore(s => s.signIn)
  const loading = useCredentialStore(s => s.loading)
  const error = useCredentialStore(s => s.error)

  return (
    <form className='form'
      onSubmit={e => {
        e.preventDefault()
        void signIn(input)
      }}
    >

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        autoComplete="username"
        required
        value={input.username}
        onChange={e => setInput(prev => ({ ...prev, username: e.target.value }))}
      // placeholder="Username"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        required
        value={input.password}
        onChange={e => setInput(prev => ({ ...prev, password: e.target.value }))}
      // placeholder="Password"
      />

      {loading
        ? <span role="status" aria-label="Signing in">
          <Loader className="loader" />
        </span>
        : error && <p role="alert">{error}</p>
      }
      <button type="submit" disabled={loading} className='submit-button'>Sign in</button>
      <p>
        Don't have an account?
        <NavLink to="/register" className="register-nav"> Create one!</NavLink>
      </p>
    </form>
  )
}