import type { UUID } from '@chappy/shared'
import { useAiStore } from '../../stores/aiStore.ts'
import { useAiChatDeletion } from '../../hooks/ai/chat/useAiDeletion.ts'
import { Loader } from 'lucide-react'
import useDismissable from '../../hooks/sideEffects/useDismissable.ts'

type DeletionPopupProps = {
  selected: UUID | null
  setSelected: React.Dispatch<React.SetStateAction<UUID | null>>
  confirmDeletion: UUID | null
  setConfirmDeletion: React.Dispatch<React.SetStateAction<UUID | null>>
}
export default function DeletionPopup({
  selected,
  setSelected,
  confirmDeletion,
  setConfirmDeletion }: DeletionPopupProps) {
  const { deleteAiChat } = useAiChatDeletion()

  const error = useAiStore(s => confirmDeletion
    ? s.aiMessageData.get(confirmDeletion)?.error
    : undefined
  )

  const loading = useAiStore(s => confirmDeletion
    ? s.aiMessageData.get(confirmDeletion)?.loading
    : undefined)

  const name = useAiStore(s => confirmDeletion
    ? s.aiMetaData.get(confirmDeletion)?.metaData.name
    : undefined)

  const popupRef = useDismissable<HTMLDivElement>({
    isOpen: Boolean(confirmDeletion) && !loading,
    onDismiss: () => setConfirmDeletion(null)
  })

  const handleDeletion = async () => {
    if (!confirmDeletion) return
    const success: boolean = await deleteAiChat(confirmDeletion)
    if (!success) return

    if (confirmDeletion === selected) {
      setSelected(null)
    }
    setConfirmDeletion(null)
  }
  return confirmDeletion && (
    <div className="absolute-popup"
      ref={popupRef}
    >
      <p>Delete {name}?</p>

      <div className="popup-buttons">
        <button
          type="button"
          disabled={loading}
          className='delete-buttons deleter'
          onClick={() => void handleDeletion()}
        >
          {loading
            ? <Loader className="loader" size={16} />
            : 'DELETE'}
        </button>

        <button
          type="button"
          disabled={loading}
          className='delete-buttons'
          onClick={() => setConfirmDeletion(null)}
        >
          CANCEL
        </button>
      </div>

      {error && (
        <p role="alert">{error}</p>
      )}
    </div >
  )
}