import { useChannelMessages } from '../../hooks/channels/useChannelMessages.ts'
import { useChannelsStore } from '../../stores/channelsStore.ts'
import type { UUID } from '@chappy/shared'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useUsersStore } from '../../stores/usersStore.ts'
import { isoToDate } from '../../utils/isoToDate.ts'

type MessageProps = {
  channelId: UUID
}

export default function ChannelMessages({ channelId }: MessageProps) {
  const messageBoxRef = useRef<HTMLDivElement>(null)

  const { fetchChannelMessages } = useChannelMessages()

  const users = useUsersStore(s => s.users)

  useEffect(() => {
    void fetchChannelMessages(channelId)
  }, [channelId, fetchChannelMessages])

  const messages = useChannelsStore(s =>
    s.channelMsgData.get(channelId)?.messageData
  )

  const messageList = messages ? [...messages.values()] : []

  const resolvedList = messageList.map(entry => {
    return {
      ...entry,
      name: users.get(entry.createdBy)?.name ?? 'guest'
    }
  })

  useLayoutEffect(() => {
    const element = messageBoxRef.current
    if (!element) return

    element.scrollTop = element.scrollHeight
  }, [messages])

  return (
    <div ref={messageBoxRef} className="channel-message-box">
      <div className='channel-messages'>
        {resolvedList.map(msg => (
          <article key={msg.messageId} className='channel-msg'>
            <header className='channel-msg-header'>
              <span className='channel-msg-author'>{msg.name}</span>
              <time dateTime={msg.createdAt}>
                {isoToDate.format(new Date(msg.createdAt))}
              </time>
            </header>

            <p className='channel-msg-content'>{msg.message}</p>
          </article>
        ))}
      </div>
    </div>
  )
}