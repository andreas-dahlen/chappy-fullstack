import { useEffect, useLayoutEffect, useRef } from 'react'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { useGetAiMessages } from '../../hooks/ai/chat/useGetAiMessages.ts'
import type { UUID } from '@chappy/shared'
import { useAiStore } from '../../stores/aiStore.ts'

type ChatMessageProps = {
  selected: UUID
}

export default function ChatMessages({ selected }: ChatMessageProps) {
  const messageBoxRef = useRef<HTMLDivElement>(null)

  const token = useCredentialStore(s => s.token)
  const { getAiMessages } = useGetAiMessages()

  const messages = useAiStore(s =>
    s.aiMessageData.get(selected)?.messageData
  )

  const messageList = messages ? [...messages.values()] : []

  useLayoutEffect(() => {
    const element = messageBoxRef.current
    if (!element) return

    element.scrollTop = element.scrollHeight
  }, [messages])

  useEffect(() => {
    if (!token || !selected) return
    void getAiMessages(selected, token)
  }, [token, getAiMessages])

  return (
    <div ref={messageBoxRef} className='ai-messages'>
      {messageList.map(msg => (
        <div key={msg.messageId}>{msg.message}</div>
      )
      )}
    </div>
  )
}