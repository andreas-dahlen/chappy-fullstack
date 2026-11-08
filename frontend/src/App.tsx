import { Outlet } from 'react-router'
import './styles/app.css'
import LeftSideBar from './layout/LeftSideBar.tsx'
import Header from './layout/Header.tsx'
import { useState } from 'react'
import { useSignOutNavigation } from './authHandlers/useSignOutNavigation.ts'
import RightSideBar from './layout/rightSideBar.tsx'
import { useSocket } from './hooks/socket/useSocket.ts'

export default function App() {

  useSocket()
  useSignOutNavigation()
  const [isAiDisplayed, setIsAiDisplayed] = useState<boolean>(false)

  return (
    <div className="app">

      <Header toggleAi={setIsAiDisplayed} isAiDisplayed={isAiDisplayed} />

      <div className='layout' >
        <LeftSideBar />

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