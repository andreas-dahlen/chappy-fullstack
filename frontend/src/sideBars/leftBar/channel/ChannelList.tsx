import '../../../styles/aside/channel.css'
import type { Channel, UUID } from '@chappy/shared'
import { useLocation, useNavigate } from 'react-router'
import { type ChannelStoreData } from '../../../stores/channelsStore.ts'
import { Loader, Lock, Trash2 } from 'lucide-react'
import { useCredentialStore } from '../../../stores/credentialStore.ts'
import { useChannelDeletion } from '../../../hooks/channels/useChannelDeletion.ts'
import { useState } from 'react'
import useDismissable from '../../../hooks/sideEffects/useDismissable.ts'

type ChannelListProps = {
  channels: Map<string, ChannelStoreData>
}

export default function ChannelList({
  channels
}: ChannelListProps) {
  const token = useCredentialStore(s => s.token)
  const userId = useCredentialStore(s => s.userId)
  const { deleteChannel } = useChannelDeletion()
  const [confirmDeletion, setConfirmDeletion] = useState<UUID | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const resolveActive = (id: string) => {
    if (location.pathname === `/channels/${id}`) {
      return 'active'
    }
    return ''
  }

  const confirmingChannel = confirmDeletion
    ? channels.get(confirmDeletion)
    : undefined

  const popupRef = useDismissable<HTMLDivElement>({
    isOpen: Boolean(confirmDeletion) && !confirmingChannel?.loading,
    onDismiss: () => setConfirmDeletion(null)
  })


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
        {sortedChannels.map((data) => {
          const isOwner = token && data.channel.createdBy === userId
          const isConfirmingDeletion = confirmDeletion && confirmDeletion === data.channel.channelId && isOwner
          const isActive = confirmDeletion === data.channel.channelId

          return (
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

              {isOwner && (
                <button
                  type="button"
                  className={`channel-delete-button ${isActive ? 'active' : ''}`}
                  disabled={isActive}
                  onClick={() => setConfirmDeletion(data.channel.channelId)}
                  aria-label={`Delete ${data.channel.channelName}`}
                >
                  <Trash2 size={18} className="icon" />
                </button>
              )}

              {isConfirmingDeletion && (
                <>
                  {confirmDeletion && confirmDeletion === data.channel.channelId && (
                    <div ref={popupRef} className="deletion-box relative">
                      <p>Delete {data.channel.channelName}?</p>

                      <div className="popup-buttons">
                        <button
                          type="button"
                          disabled={data.loading}
                          className='delete-buttons deleter'
                          onClick={() => void deleteChannel(data.channel.channelId)}
                        >
                          {data.loading
                            ? <Loader className="loader" size={16} />
                            : 'DELETE'}
                        </button>

                        <button
                          type="button"
                          disabled={data.loading}
                          className='delete-buttons'
                          onClick={() => setConfirmDeletion(null)}
                        >
                          CANCEL
                        </button>
                      </div>

                      {data.error && (
                        <p role="alert">{data.error}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          )
        })
        }
      </ul >
    </>
  )
}