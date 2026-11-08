import '../../../styles/aside/channel.css'
import type { Channel } from '@chappy/shared'
import { useLocation, useNavigate } from 'react-router'
import { type ChannelStoreData } from '../../../stores/channelsStore.ts'
import { Lock, Trash2 } from 'lucide-react'
import { useCredentialStore } from '../../../stores/credentialStore.ts'
import { useChannelDeletion } from '../../../hooks/channels/useChannelDeletion.ts'

type ChannelListProps = {
  channels: Map<string, ChannelStoreData>
}

export default function ChannelList({
  channels
}: ChannelListProps) {
  const token = useCredentialStore(s => s.token)
  const userId = useCredentialStore(s => s.userId)
  const { deleteChannel } = useChannelDeletion()

  const navigate = useNavigate()
  const location = useLocation()
  const resolveActive = (id: string) => {
    if (location.pathname === `/channels/${id}`) {
      return 'active'
    }
    return ''
  }

  const handleChannelClick = (channel: Channel) => {
    if (channel.authRequired && !token) {
      navigate('/sign-in', {
        state: {
          reason: 'enter-channel',
          channelId: channel.channelId
        }
      })
      return
    }
    navigate(`/channels/${channel.channelId}`)
  }

  const sortedChannels = Array.from(channels.values()).toSorted(
    (a, b) =>
      Number(a.channel.authRequired) - Number(b.channel.authRequired) ||
      a.channel.channelName.localeCompare(b.channel.channelName, 'sv')
  )

  return (
    <>
      <ul className="channel-list">
        {sortedChannels.map((data) => (
          <li key={data.channel.channelId} className='channel-list-item'>
            <button
              type="button"
              className={`channel-button ${resolveActive(data.channel.channelId)}`}
              onClick={() => handleChannelClick(data.channel)}
            >
              <span className="channel-avatar"
                aria-hidden="true">
                {data.channel.channelName.charAt(0).toUpperCase()}
                {!token && data.channel.authRequired &&
                  <div className='lock-box'>
                    <Lock size={17} />
                  </div>}
              </span>

              <span className="channel-info">
                <span className="channel-name">{data.channel.channelName}</span>
              </span>

            </button>

            {token && data.channel.createdBy === userId && (
              <button
                type="button"
                className="channel-delete-button"
                onClick={() => deleteChannel(data.channel.channelId)}
                aria-label={`Delete ${data.channel.channelName}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </li>
        ))
        }
      </ul >
    </>
  )
}