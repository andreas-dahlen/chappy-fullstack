import { useEffect } from 'react'
import { useChannelMessages } from '../../hooks/useChannelMessages.ts'
import { useChannelsStore } from '../../stores/channelsStore.ts'
import type { UUID } from '@chappy/shared'

type MessageProps = {
  channelId: UUID
}
export default function ChannelMessages({
  channelId
}: MessageProps) {

  const { fetchChannelMessages } = useChannelMessages()
  useEffect(() => {
    void fetchChannelMessages(channelId)
  }, [channelId, fetchChannelMessages])

  const messages = useChannelsStore(s =>
    channelId ? s.channelMsgData.get(channelId) : undefined
  )

  return (
    <div>

      {messages?.messageData.map(msg => {
        return <p key={msg.messageId}>{msg.message}</p>
      })
      }
    </div>
  )
}