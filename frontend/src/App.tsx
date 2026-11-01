import { Outlet } from 'react-router'
import './styles/app.css'
import LeftSideBar from './layout/LeftSideBar.tsx'
import Header from './layout/Header.tsx'
import { useState } from 'react'
import { useSignOutNavigation } from './hooks/useSignOutNavigation.ts'

export default function App() {

  useSignOutNavigation()
  const [isAiDisplayed, setIsAiDisplayed] = useState<boolean>(false)

  return (
    <div className="app">

      <Header toggleAi={setIsAiDisplayed} isAiDisplayed={isAiDisplayed} />

      <div className='layout' >
        <LeftSideBar />

        <div className={`workspace ${isAiDisplayed ? 'ai-displayed' : ''}`}>
          <main>
            {/* <div className='page-content'> */}
            <Outlet />
            {/* </div> */}
          </main>
          {isAiDisplayed && <aside
            className="ai-sidebar"> {/* AI assistant */}
          </aside>}
        </div>
      </div>
    </div>
  )
}