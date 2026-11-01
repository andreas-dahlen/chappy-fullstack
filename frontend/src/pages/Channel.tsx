import { NavLink, useParams } from 'react-router'
import { useChannelsStore } from '../stores/channelsStore.ts'
import { useEffect } from 'react'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { useChannels } from '../hooks/useChannels.ts'
import ChannelMessages from '../features/channel/ChannelMessages.tsx'
import '../styles/pages/channel.css'
import ChannelInput from '../features/channel/ChannelInput.tsx'

export default function Channel() {

  const { channelId } = useParams()

  const token = useCredentialStore(s => s.token)

  const channel = useChannelsStore(s =>
    s.activeChannels.find(c => c.channelId === channelId)
  )

  const loading = useChannelsStore(s => s.loading)
  const hasFetchedChannels = useChannelsStore(s => s.hasFetchedChannels)

  const { fetchChannels } = useChannels()

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  if (loading || !hasFetchedChannels) {
    return <p>Loading channel...</p>
  }

  if (!channelId || !channel) return (
    <div className='faulty-state'>
      <p>Ooops! Could not load the channel</p>
      <NavLink to="/" replace>Home</NavLink>
    </div>
  ) //TODO add error handling error = useChannelsStore(s => s.error) and messages.error

  if (!token && channel.authRequired) {
    return (
      <div className='faulty-state'>
        <p>You need to sign in to view this channel.</p>
        <NavLink to="/sign-in" replace>Sign in</NavLink>
      </div>
    )
  }

  return (
    <div className='channel-page'>
      <div className='channel-header'>
        <p >
          {channel.channelName}
        </p>
      </div>
      <div className="channel-view">
        <ChannelMessages channelId={channelId} />
        <ChannelInput channelId={channelId} />
      </div>

    </div>
  )
}