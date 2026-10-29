import { useState } from 'react'
import ControlPanel from '../LeftSideBar/ControlPanel.tsx'
import UserConversations from '../LeftSideBar/UserConversations.tsx'
import Channels from '../LeftSideBar/Channels.tsx'

export type Section = 'conversations' | 'groups' | 'settings'

export default function LeftSideBar() {
  const [section, setSection] = useState<Section>('conversations')

  return (
    <aside className="sidebar">
      <ControlPanel onSelect={setSection} selected={section} />

      <section className="sidebar-content">
        {section === 'conversations' && <UserConversations />}
        {section === 'groups' && <Channels />}
        {section === 'settings' && <div>Settings</div>}
      </section>
    </aside>
  )
}