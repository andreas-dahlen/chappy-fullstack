import { useChannelMessages } from '../../hooks/useChannelMessages.ts'
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

  const activeUsers = useUsersStore(s => s.activeUsers)

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
      name: activeUsers.find(user => user.userId === entry.createdBy)?.name ?? 'guest'
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
          <div key={msg.messageId} className='channel-msg'>

            <p >{msg.message}</p>
            <p>{msg.name}</p>
            <p>{isoToDate.format(new Date(msg.createdAt))}</p>
          </div>
        ))}
      </div>
    </div>
  )
}