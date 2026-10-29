import { useEffect } from 'react'
import '../styles/aside/channel.css'
import type { Channel } from '@chappy/shared'
import { useLocation, useNavigate } from 'react-router'
import { useChannelsStore } from '../stores/channelsStore.ts'
import { Lock } from 'lucide-react'

export default function Channels() {
  const channels = useChannelsStore(s => s.activeChannels)
  const loading = useChannelsStore(s => s.loading)
  const error = useChannelsStore(s => s.error)
  const fetchChannels = useChannelsStore(s => s.fetchChannels)

  useEffect(() => {
    void fetchChannels()
  }, [fetchChannels])

  const navigate = useNavigate()
  const location = useLocation()
  // const conversations = useConversationsStore(s => s.conversations)
  const resolveActive = (id: string) => {
    if (location.pathname === `/channels/${id}`) {
      return 'active'
    }
    return ''
  }
  // const isActive =
  //   location.pathname === `/channels/${channels.channelId}`

  const handleChannelClick = (channel: Channel) => {
    if (channel.authRequired) {
      void navigate('/login', {
        state: {
          reason: 'enter-channel'
        }
      })
      return
    }
    void navigate(`/channels/${channel.channelId}`)
  }



  if (loading && channels.length === 0) {
    return <p>Loading channels...</p>
  }
  if (error) {
    return <p>Failed to load channels: {error}</p>
  }
  if (channels.length === 0) {
    return <p>No channels found.</p>
  }
  return (
    <ul className="channel-list">
      {channels.map((channel) => (
        <li key={channel.channelId} className={`channel-list-item ${resolveActive(channel.channelId)}`}>
          <button
            type="button"
            className="channel-button"
            onClick={() => handleChannelClick(channel)}
          >
            <span className="channel-avatar"
              aria-hidden="true">
              {channel.channelName.charAt(0).toUpperCase()}
              {channel.authRequired && <div className='lock-box'>
                <Lock className={"lock"} size={17} />
              </div>}
            </span>

            <span className="channel-info">
              <span className="channel-name">{channel.channelName}</span>
            </span>
          </button>
        </li>
      ))
      }
    </ul >
  )
}