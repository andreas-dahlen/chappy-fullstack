import { Bot, Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { useCredentialStore } from '../stores/credentialStore.ts';
import '../styles/header.css'
import useMediaQuery from '../hooks/sideEffects/useMediaQuery.ts';

type HeaderProps = {
  toggleAi: React.Dispatch<React.SetStateAction<boolean>>
  isAiDisplayed: boolean
  toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>
  hamburgerRef: React.RefObject<HTMLButtonElement | null>
  isSidebarOpen: boolean
}

export default function Header(
  { toggleAi,
    isAiDisplayed,
    toggleSidebar,
    hamburgerRef,
    isSidebarOpen }: HeaderProps) {
  const name = useCredentialStore(s => s.name)
  const token = useCredentialStore(s => s.token)
  const signOut = useCredentialStore(s => s.signOut)
  const isMobile = useMediaQuery('(max-width: 570px)')

  return (
    <header>
      <Link to="/" className="logo">
        Chappy
      </Link>
      <div className='info-and-nav'>
        {!isMobile && <div className='auth-info'>
          <p>{name}</p>
        </div>}

        {!isMobile ? (

          <nav className='nav-box'>
            <button
              onClick={() => toggleAi(s => s = !s)}
              className={`nav-icon ${isAiDisplayed ? 'active' : ''}`}>
              <Bot size={35} />
            </button>
            {token
              ? <button onClick={() => signOut('manual')} className='nav-button'>Sign out</button>
              : <NavLink to="sign-in" className='nav-button'>Sign in</NavLink>
            }
          </nav>
        ) : (
          <nav className="mobile-nav">
            <button
              onClick={() => toggleAi(s => s = !s)}
              className={`nav-icon ${isAiDisplayed ? 'active' : ''}`}>
              <Bot size={35} />
            </button>
            <button
              ref={hamburgerRef}
              type='button'
              className={`hamburger-button ${isSidebarOpen ? 'active' : ''}`}
              onClick={() => toggleSidebar(prev => !prev)}
            >
              <Menu size={35}></Menu>
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}