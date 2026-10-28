import { useState } from 'react'
import ControlPanel from '../LeftSideBar/ControlPanel.tsx'
import UserConversations from '../LeftSideBar/UserConversations.tsx'

export type Section = 'conversations' | 'groups' | 'settings'

export default function LeftSideBar() {
  const [section, setSection] = useState<Section>('conversations')

  return (
    <aside className="sidebar">
      <ControlPanel onSelect={setSection} selected={section} />

      <div className="sidebar-content">
        {section === 'conversations' && <UserConversations />}
        {section === 'groups' && <div>groups</div>}
        {section === 'settings' && <div>Settings</div>}
      </div>
    </aside>
  )
}