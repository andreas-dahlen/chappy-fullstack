import { Outlet } from 'react-router'
import './styles/app.css'
import LeftSideBar from './layout/LeftSideBar.tsx'

export default function App() {
  return (
    <div className="app">

      <header>
        <div>Chappy</div>
        <div>
          {/* Login / Profile */}
        </div>
      </header>

      <div className="layout">
        <LeftSideBar />
        <main>
          <Outlet />
        </main>
        <aside className="ai-sidebar"> {/* AI assistant */}
        </aside>
      </div>
    </div>
  )
}