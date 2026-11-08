import type { UUID } from '@chappy/shared'
import { useAiStore } from '../../stores/aiStore.ts'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type SelectionPanelProps = {
  selected: UUID | null
  setSelected: React.Dispatch<React.SetStateAction<UUID | null>>
}
export default function SelectionPanel({ selected, setSelected }: SelectionPanelProps) {
  const metaData = useAiStore(s => s.aiMetaData)

  const [isOpen, setIsOpen] = useState(false)

  const selectedName = selected
    ? metaData.get(selected)?.metaData?.name
    : undefined

  if (metaData.size === 0) return null

  return (
    <div className='selection-panel'>
      <button
        type='button'
        className={`selection-trigger ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span>{selectedName ?? 'Select a conversation'}</span>
        {isOpen
          ? <ChevronUp />
          : <ChevronDown />
        }
      </button>

      {isOpen && (
        <ul className='drop-down-list'>
          {[...metaData.values()].map(d => {
            const aiId = d.metaData?.aiId
            if (!aiId) return null

            return (
              <li key={aiId}>
                <button
                  type='button'
                  className={`drop-down-button ${selected === aiId ? 'active' : ''}`}
                  onClick={() => {
                    setSelected(aiId)
                    setIsOpen(false)
                  }}
                >
                  {d.metaData.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}