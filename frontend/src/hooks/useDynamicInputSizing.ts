import { useCallback } from 'react'

export function useDynamicInputSizing() {
  const handleInputSizing = useCallback((event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget

    textarea.style.height = 'auto'

    const styles = window.getComputedStyle(textarea)
    const maxHeight = Number.parseFloat(styles.maxHeight)
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight)

    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [])

  const resetInputSizing = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.overflowY = 'hidden'
  }, [])

  return { handleInputSizing, resetInputSizing }
}