import type { UUID } from '@chappy/shared'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { isoToDate } from '../../utils/isoToDate.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'
import { useConversationMessages } from '../../hooks/conversations/useConversationMessages.ts'
type ConversationMessagesProps = {
  conversationId: UUID
}

export default function ConversationMessages({ conversationId }: ConversationMessagesProps) {


  const messageBoxRef = useRef<HTMLDivElement>(null)

  const { fetchConversationMessages } = useConversationMessages()

  const hasFetchedMsgs = useConversationStore(s =>
    s.conversationMsgData.get(conversationId)?.hasFetchedMsgs ?? false
  )

  useEffect(() => {
    if (!hasFetchedMsgs) {
      void fetchConversationMessages(conversationId)
    }
  }, [conversationId, hasFetchedMsgs, fetchConversationMessages])

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
          <article key={msg.messageId} className='conversation-msg'>
            <header className='conversation-msg-header'>
              <span className='conversation-msg-author'>{msg.name}</span>
              <time dateTime={msg.createdAt}>
                {isoToDate.format(new Date(msg.createdAt))}
              </time>
            </header>

            <p className='conversation-msg-content'>{msg.message}</p>
          </article>
        ))}
      </div>
    </div>
  )
}