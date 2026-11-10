import { useCallback, useEffect, useState } from 'react'
import ControlPanel from '../sideBars/leftBar/ControlPanel.tsx'
import Conversations from '../sideBars/leftBar/Conversations.tsx'
import Channels from '../sideBars/leftBar/channel/Channels.tsx'
import Settings from '../sideBars/leftBar/settings/Settings.tsx'
import useDismissable from '../hooks/sideEffects/useDismissable.ts'
import useMediaQuery from '../hooks/sideEffects/useMediaQuery.ts'
import { Link, NavLink, useLocation } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'

export type Section = 'conversations' | 'channels' | 'settings'

type LeftSideBarProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  hamburgerRef: React.RefObject<HTMLButtonElement | null>
  setIsAiDisplayed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LeftSideBar({
  isOpen,
  setIsOpen,
  hamburgerRef,
  setIsAiDisplayed
}: LeftSideBarProps) {
  const [section, setSection] = useState<Section>('conversations')
  const name = useCredentialStore(s => s.name)
  const signOut = useCredentialStore(s => s.signOut)
  const token = useCredentialStore(s => s.token)

  const isMobile = useMediaQuery('(max-width: 570px)')
  const popupRef = useDismissable<HTMLElement>({
    isOpen: isOpen && isMobile,
    onDismiss: () => setIsOpen(false),
    triggerRef: hamburgerRef
  })

  const resetState = useCallback(() => {
    if (isMobile) {
      setIsOpen(false)
      setIsAiDisplayed(false)
    }
  }, [isMobile, setIsOpen, setIsAiDisplayed])
  const location = useLocation()

  useEffect(() => {
    resetState()
  }, [location.pathname, resetState])

  return (
    <aside ref={popupRef} className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {isMobile && <div className='auth-info-mobile'>
        {token ? <p>{name}</p> : <Link to="/" onClick={resetState} className="logo">
          Chappy
        </Link>}

        {token
          ? <button onClick={() => signOut('manual')} className='nav-button'>Sign out</button>
          : <NavLink to="sign-in" onClick={resetState} className='nav-button'>Sign in</NavLink>
        }
      </div>}
      <div className={`${isMobile ? 'mobile-sidebar' : 'preserve-height'}`}>
        <ControlPanel setSelect={setSection} selected={section} />

        <section className="sidebar-content">
          {section === 'conversations' && <Conversations />}
          {section === 'channels' && <Channels />}
          {section === 'settings' && <Settings />}
        </section>
      </div>
    </aside>
  )
}