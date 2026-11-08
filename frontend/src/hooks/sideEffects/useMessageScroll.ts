import { useCallback, useRef, useState } from 'react'

export function useMessageScroll() {
  const messageBoxRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)

  const handleScroll = useCallback(() => {
    const element = messageBoxRef.current
    if (!element) return

    setAtBottom(
      element.scrollHeight - element.scrollTop - element.clientHeight < 50
    )
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const element = messageBoxRef.current
    if (!element) return

    element.scrollTo({
      top: element.scrollHeight,
      behavior
    })
  }, [])

  return {
    messageBoxRef,
    atBottom,
    handleScroll,
    scrollToBottom
  }
}

//TODO implment this