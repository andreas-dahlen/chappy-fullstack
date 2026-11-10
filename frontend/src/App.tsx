import { Outlet } from 'react-router'
import './styles/app.css'
import './styles/utils.css'
import LeftSideBar from './layout/LeftSideBar.tsx'
import Header from './layout/Header.tsx'
import { useRef, useState } from 'react'
import { useSignOutNavigation } from './authHandlers/useSignOutNavigation.ts'
import RightSideBar from './layout/rightSideBar.tsx'
import { useSocket } from './hooks/socket/useSocket.ts'

export default function App() {

  useSocket()
  useSignOutNavigation()
  const [isAiDisplayed, setIsAiDisplayed] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="app">

      <Header
        toggleAi={setIsAiDisplayed}
        isAiDisplayed={isAiDisplayed}
        toggleSidebar={setIsSidebarOpen}
        hamburgerRef={hamburgerRef}
        isSidebarOpen={isSidebarOpen}
      />

      <div className='layout' >
        <LeftSideBar
          hamburgerRef={hamburgerRef}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setIsAiDisplayed={setIsAiDisplayed}
        />

        <div className={`workspace ${isAiDisplayed ? 'ai-displayed' : ''}`}>
          <main>
            <Outlet />
          </main>
          {isAiDisplayed && <RightSideBar hideAi={() => setIsAiDisplayed(false)} />}
        </div>
      </div>
    </div>
  )
}