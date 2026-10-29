import { MessagesCircle, Settings, UserRoundGroup } from 'lucide-react'
import type { Section } from '../layout/LeftSideBar.tsx'
import '../styles/aside/aside.css'

type ControlPanelProps = {
  onSelect: (section: Section) => void
  selected: Section
}
export default function ControlPanel({
  onSelect,
  selected
}: ControlPanelProps) {

  return (
    <nav aria-label="control panel" className='control-panel-fixed'>
      <div className="control-panel">
        <button
          type="button"
          aria-label="conversations"
          onClick={() => onSelect('conversations')}
          className={`ctrl-button ${selected === 'conversations' ? 'active' : ''}`}
        >
          <MessagesCircle size={33} className="icon" />
        </button>
        <button
          type="button"
          aria-label="groups"
          onClick={() => onSelect('groups')}
          className={`ctrl-button ${selected === 'groups' ? 'active' : ''}`}
        >
          <UserRoundGroup size={33} className="icon" />
        </button>
        <button
          type="button"
          aria-label="settings"
          onClick={() => onSelect('settings')}
          className={`ctrl-button ${selected === 'settings' ? 'active' : ''}`}
        >
          <Settings size={33} className="icon" />
        </button>
      </div>
    </nav>
  )
}