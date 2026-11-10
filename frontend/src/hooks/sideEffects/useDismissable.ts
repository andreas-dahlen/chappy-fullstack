import { useEffect, useRef } from 'react'

type UseDismissableProps = {
  isOpen: boolean
  onDismiss: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

export default function useDismissable<T extends HTMLElement>({
  isOpen,
  onDismiss,
  triggerRef
}: UseDismissableProps) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      const isInsidePopup = ref.current?.contains(target)
      const isInsideTrigger = triggerRef?.current?.contains(target)

      if (!isInsidePopup && !isInsideTrigger) {
        onDismiss()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onDismiss, triggerRef])

  return ref
}