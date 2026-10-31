import { Bot } from 'lucide-react';
import { NavLink } from 'react-router';
import { useCredentialStore } from '../stores/credentialStore.ts';
import '../styles/header.css'

type HeaderProps = {
  toggleAi: React.Dispatch<React.SetStateAction<boolean>>
  isAiDisplayed: boolean
}

export default function Header(
  { toggleAi, isAiDisplayed }: HeaderProps) {
  const name = useCredentialStore(s => s.name)
  const token = useCredentialStore(s => s.token)
  const signOut = useCredentialStore(s => s.signOut)
  return (
    <header>
      <div>Chappy</div>
      <div className='info-and-nav'>
        <div className='auth-info'>
          <p>{name}</p>
        </div>
        <nav className='nav-box'>
          <button
            onClick={() => toggleAi(s => s = !s)}
            className={`nav-icon ${isAiDisplayed ? 'active' : ''}`}>
            <Bot size={35} />
          </button>
          {token
            ? <button onClick={signOut} className='nav-button'>Sign out</button>
            : <NavLink to="sign-in" className='nav-button'>Sign in</NavLink>
          }

        </nav>
      </div>
    </header>
  )
}