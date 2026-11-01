import { useChannelMessages } from '../../hooks/useChannelMessages.ts'
import { useChannelsStore } from '../../stores/channelsStore.ts'
import type { UUID } from '@chappy/shared'
import { useEffect, useLayoutEffect, useRef } from 'react'

type MessageProps = {
  channelId: UUID
}

export default function ChannelMessages({ channelId }: MessageProps) {
  const messageBoxRef = useRef<HTMLDivElement>(null)

  const { fetchChannelMessages } = useChannelMessages()

  useEffect(() => {
    void fetchChannelMessages(channelId)
  }, [channelId, fetchChannelMessages])

  const messages = useChannelsStore(s =>
    s.channelMsgData.get(channelId)?.messageData
  )

  const messageList = messages ? [...messages.values()] : []

  useLayoutEffect(() => {
    const element = messageBoxRef.current
    if (!element) return

    element.scrollTop = element.scrollHeight
  }, [messages])

  return (
    <div ref={messageBoxRef} className="channel-message-box">
      {messageList.map(msg => (
        <p key={msg.messageId}>{msg.message}</p>
      ))}
    </div>
  )
}