import type { UUID } from '@chappy/shared'
import { useAiStore } from '../../stores/aiStore.ts'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import useDismissable from '../../hooks/sideEffects/useDismissable.ts'

type SelectionPanelProps = {
  selected: UUID | null
  setSelected: React.Dispatch<React.SetStateAction<UUID | null>>
  setConfirmDeletion: React.Dispatch<React.SetStateAction<UUID | null>>
}
export default function SelectionPanel({
  selected,
  setSelected,
  setConfirmDeletion }: SelectionPanelProps) {
  const metaData = useAiStore(s => s.aiMetaData)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const selectedName = selected
    ? metaData.get(selected)?.metaData?.name
    : undefined


  const popupRef = useDismissable<HTMLUListElement>({
    isOpen,
    onDismiss: () => setIsOpen(false)
  })


  if (metaData.size === 0) return null

  return (
    <div className='selection-panel'>
      <button
        type='button'
        className={`selection-trigger ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(prev => !prev)
          setConfirmDeletion(null)
        }}
      >
        <span>{selectedName ?? 'New conversation'}</span>
        {isOpen
          ? <ChevronUp />
          : <ChevronDown />
        }
      </button>

      {isOpen && (
        <ul ref={popupRef} className='drop-down-list'>
          <li>
            <button
              type='button'
              className='drop-down-button'
              onClick={() => {
                setSelected(null)
                setIsOpen(false)
              }}
            >
              <Plus size={16} />
              New conversation
            </button>
          </li>

          {[...metaData.values()].map(d => {
            const aiId = d.metaData?.aiId
            if (!aiId) return null
            return (
              <li key={aiId}>

                <div className='relative-button'>
                  <button
                    type='button'
                    className={`drop-down-button ${selected === aiId ? 'active' : ''}`}
                    onClick={() => {
                      setSelected(aiId)
                      setIsOpen(false)
                    }}
                  >
                    <p>
                      {d.metaData.name}
                    </p>
                  </button>

                  <button
                    type="button"
                    className='ai-delete-button'
                    onClick={() => {
                      setConfirmDeletion(aiId)
                      setIsOpen(false)
                    }}
                    aria-label={`Delete ${d.metaData.name}`}
                  >
                    <Trash2 size={18} className="icon" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}