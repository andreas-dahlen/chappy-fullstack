import { useParams } from 'react-router'
import { useChannelsStore } from '../stores/channelsStore.ts'

export default function Channel() {

  const { channelId } = useParams()

  const channel = useChannelsStore(s =>
    s.activeChannels.find(channel => channel.channelId === channelId)
  )

  return (
    <div>{channel?.channelName}</div>
  )
}