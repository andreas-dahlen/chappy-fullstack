import { useState } from 'react'
import ControlPanel from '../sideBars/leftBar/ControlPanel.tsx'
import Conversations from '../sideBars/leftBar/Conversations.tsx'
import Channels from '../sideBars/leftBar/channel/Channels.tsx'
import Settings from '../sideBars/leftBar/settings/Settings.tsx'

export type Section = 'conversations' | 'channels' | 'settings'

export default function LeftSideBar() {
  const [section, setSection] = useState<Section>('conversations')

  return (
    <aside className="sidebar">
      <ControlPanel setSelect={setSection} selected={section} />

      <section className="sidebar-content">
        {section === 'conversations' && <Conversations />}
        {section === 'channels' && <Channels />}
        {section === 'settings' && <Settings />}
      </section>
    </aside>
  )
}