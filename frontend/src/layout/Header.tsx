import { Bot } from 'lucide-react';
import { NavLink } from 'react-router';
import { useCredentialStore } from '../stores/credentialStore.ts';

type HeaderProps = {
  toggleAi: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header(
  { toggleAi }: HeaderProps) {
  const name = useCredentialStore(s => s.name)
  // const token = useCredentialStore(s => s.token)
  // const uuid = useCredentialStore(s => s.userId)
  return (
    <header>
      <div>Chappy</div>
      <div>
        <div className='auth-info'>
          <p>{name}</p>
          {/* <p>{token}</p> */}
          {/* <p>{uuid}</p> */}
        </div>
        <nav className='nav-box'>
          <a onClick={() => toggleAi(s => s = !s)}>
            <Bot />
          </a>
          <NavLink to="sign-in">Sign in</NavLink>
        </nav>
      </div>
    </header>
  )
}