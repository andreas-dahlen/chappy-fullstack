import { Outlet } from 'react-router'
import './styles/app.css'
import LeftSideBar from './layout/LeftSideBar.tsx'
import Header from './layout/Header.tsx'
import { useState } from 'react'

export default function App() {

  const [isAiDisplayed, setIsAiDisplayed] = useState<boolean>(false)

  return (
    <div className="app">

      <Header toggleAi={setIsAiDisplayed} />

      <div className={`layout ${isAiDisplayed ? 'ai-displayed' : ''}`}>
        <LeftSideBar />
        <main>
          <Outlet />
        </main>
        {isAiDisplayed && <aside className="ai-sidebar"> {/* AI assistant */}</aside>}
      </div>
    </div>
  )
}