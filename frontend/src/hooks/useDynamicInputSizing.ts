import { useCallback } from 'react'

export function useDynamicInputSizing() {
  const handleInputSizing = useCallback((event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight

    const styles = window.getComputedStyle(textarea)
    const minHeight = Number.parseFloat(styles.minHeight)
    const maxHeight = Number.parseFloat(styles.maxHeight)

    const nextHeight = Math.min(
      Math.max(scrollHeight, minHeight),
      maxHeight
    )
    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY =
      scrollHeight > maxHeight ? 'auto' : 'hidden'

    //padding calculations

    const padding =
      Number.parseFloat(styles.paddingTop) +
      Number.parseFloat(styles.paddingBottom)

    const contentHeight = scrollHeight - padding

    const lineHeight = Number.parseFloat(styles.lineHeight)
    const singleLineThreshold = lineHeight

    // console.log({
    //   scrollHeight,
    //   clientHeight: textarea.clientHeight,
    //   minHeight,
    //   lineHeight: styles.lineHeight,
    //   paddingTop: styles.paddingTop,
    //   paddingBottom: styles.paddingBottom,
    //   contentHeight
    // })

    if (contentHeight > singleLineThreshold) {
      textarea.style.paddingBottom = '0.8rem'
    } else {
      textarea.style.paddingBottom = '0rem'
    }

  }, [])

  const resetInputSizing = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.overflowY = 'hidden'
    textarea.style.paddingBottom = '0rem'
  }, [])

  return { handleInputSizing, resetInputSizing }
}