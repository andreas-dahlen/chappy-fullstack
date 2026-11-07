import { MessagesCircle, Settings, UserRoundGroup } from 'lucide-react'
import type { Section } from '../../layout/LeftSideBar.tsx'
import '../../styles/aside/aside.css'

type ControlPanelProps = {
  setSelect: (section: Section) => void
  selected: Section
}
export default function ControlPanel({
  setSelect,
  selected
}: ControlPanelProps) {

  return (
    <nav aria-label="control panel" className='control-panel-fixed'>
      <div className="control-panel">
        <button
          type="button"
          aria-label="conversations"
          onClick={() => setSelect('conversations')}
          className={`ctrl-button ${selected === 'conversations' ? 'active' : ''}`}
        >
          <MessagesCircle size={33} className="icon" />
        </button>
        <button
          type="button"
          aria-label="channels"
          onClick={() => setSelect('channels')}
          className={`ctrl-button ${selected === 'channels' ? 'active' : ''}`}
        >
          <UserRoundGroup size={33} className="icon" />
        </button>
        <button
          type="button"
          aria-label="settings"
          onClick={() => setSelect('settings')}
          className={`ctrl-button ${selected === 'settings' ? 'active' : ''}`}
        >
          <Settings size={33} className="icon" />
        </button>
      </div>
    </nav>
  )
}