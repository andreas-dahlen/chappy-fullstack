import { useState } from 'react'
import Summary from '../sideBars/rightAiBar/Summary.tsx'
import '../styles/aside/ai-side.css'
import Chat from '../sideBars/rightAiBar/Chat.tsx'
import AiControlPanel from '../sideBars/rightAiBar/AiControlPanel.tsx'
import ChatInput from '../sideBars/rightAiBar/ChatInput.tsx'
export type AiSection = 'Summary' | 'Chat'

type RightSideBarProps = {
  hideAi: () => void
}
export default function RightSideBar({ hideAi }: RightSideBarProps) {
  const [section, setSection] = useState<AiSection>('Summary')

  return (
    <aside className="ai-sidebar">
      <AiControlPanel setSelect={setSection} selected={section}
        hideAi={hideAi}></AiControlPanel>
      <section className="ai-view">
        {section === 'Summary' && <Summary />}
        {section === 'Chat' && <Chat />}
      </section>

      {section === 'Chat' && <ChatInput />}
    </aside>
  )
}