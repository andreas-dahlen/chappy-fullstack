import { MessageSquareText, Minimize2, ScanText } from 'lucide-react'
import '../../styles/aside/aside.css'
import type { AiSection } from '../../layout/rightSideBar.tsx'

type ControlPanelProps = {
  setSelect: (section: AiSection) => void
  selected: AiSection
  hideAi: () => void
}
export default function AiControlPanel({
  setSelect,
  selected,
  hideAi
}: ControlPanelProps) {

  return (
    <nav aria-label="ai control panel" className='control-panel-fixed-ai'>
      <button
        type='button'
        aria-label="minimize"
        onClick={hideAi}
        className='ctrl-button'>
        <Minimize2 className='icon'></Minimize2>
      </button>

      <h2>{selected}</h2>

      <div className="control-panel-ai">
        <button
          type="button"
          aria-label="channels"
          onClick={() => setSelect('Summary')}
          className={`ctrl-button 
            ${selected === 'Summary'
              ? 'active'
              : ''}`}>
          <ScanText size={25} className="icon" />
        </button>

        <button
          type="button"
          aria-label="conversations"
          onClick={() => setSelect('Chat')}
          className={`ctrl-button ${selected === 'Chat' ? 'active' : ''}`}>
          <MessageSquareText size={25} className="icon" />
        </button>
      </div>
    </nav>
  )
}