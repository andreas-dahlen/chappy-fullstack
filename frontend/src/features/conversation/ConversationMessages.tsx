import type { UUID } from '@chappy/shared'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { isoToDate } from '../../utils/isoToDate.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'
import { useConversationMessages } from '../../hooks/useConversationMessages.ts'
type ConversationMessagesProps = {
  conversationId: UUID
}

export default function ConversationMessages({ conversationId }: ConversationMessagesProps) {


  const messageBoxRef = useRef<HTMLDivElement>(null)

  const { fetchConversationMessages } = useConversationMessages()

  useEffect(() => {
    void fetchConversationMessages(conversationId)
  }, [conversationId, fetchConversationMessages])

  const messages = useConversationStore(s =>
    s.conversationMsgData.get(conversationId)?.messageData
  )

  const messageList = messages ? [...messages.values()] : []

  const metaData = useConversationStore(s => s.conversationMetaData).get(conversationId)?.metaData

  const resolvedList = messageList.map(entry => {
    return {
      ...entry,
      name: entry.createdBy === metaData?.participantId
        ? metaData.participantName
        : 'you'
    }
  })

  useLayoutEffect(() => {
    const element = messageBoxRef.current
    if (!element) return

    element.scrollTop = element.scrollHeight
  }, [messages])

  return (
    <div ref={messageBoxRef} className="conversation-message-box">
      <div className='conversation-messages'>
        {resolvedList.map(msg => (
          <div key={msg.messageId} className='conversation-msg'>

            <p >{msg.message}</p>
            <p>{msg.name}</p>
            <p>{isoToDate.format(new Date(msg.createdAt))}</p>
          </div>
        ))}
      </div>
    </div>
  )
}