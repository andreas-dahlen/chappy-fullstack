import { NavLink, useParams } from 'react-router'
import { useChannelsStore } from '../stores/channelsStore.ts'
// import { useEffect } from 'react'

export default function Channel() {

  const { channelId } = useParams()

  const channel = useChannelsStore(s =>
    s.activeChannels.find(channel => channel.channelId === channelId)
  )
  // useEffect(() => {
  //a handler that handles fetching messages and meta data... and authed...
  // }[])

  if (!channel) return (
    <div>
      <p>Ooops! Could not load the channel</p>
      <NavLink to="/">Home</NavLink>
    </div>
  )

  if (channel.authRequired)

    return (
      <div>{channel.channelName}</div>
    )
}