import { useEffect, useState } from 'react'
import '../../../styles/aside/channel.css'
import { useChannelsStore } from '../../../stores/channelsStore.ts'
import { useChannels } from '../../../hooks/channels/useChannels.ts'
import SidebarHeader from '../SidebarHeader.tsx'
import ChannelList from './ChannelList.tsx'
import ChannelCreation from './ChannelCreation.tsx'
import { useCredentialStore } from '../../../stores/credentialStore.ts'
import { Loader, Plus, Undo2 } from 'lucide-react'

export type ChannelView = 'list' | 'creating'

export default function Channels() {
  const channels = useChannelsStore(s => s.channels)
  const loading = useChannelsStore(s => s.loading)
  const error = useChannelsStore(s => s.error)
  const { fetchChannels } = useChannels()
  const token = useCredentialStore(s => s.token)

  const [channelView, setChannelView] = useState<ChannelView>('list')

  useEffect(() => {
    void fetchChannels()
  }, [fetchChannels])

  useEffect(() => {
    if (!token) {
      setChannelView('list')
    }
  }, [token])

  return (
    <>
      {token && channelView === 'list' && (
        <SidebarHeader title='Channels' action={
          <button
            type='button'
            aria-label={`Add channel`}
            onClick={() => setChannelView('creating')}
            className='add-channel-nav'>
            <Plus />
          </button>} />
      )}
      {token && channelView === 'creating' && (
        <SidebarHeader title='Create channel' action={
          <button
            type='button'
            aria-label={`Back to channel list`}
            onClick={() => setChannelView('list')}
            className='add-channel-nav'>
            <Undo2 />
          </button>} />
      )}

      {!token && <SidebarHeader title='Channels' />}

      {channelView === 'list' && (
        <>
          {loading && channels.size === 0 && (
            <div className="placement">
              <Loader className="loader" size={40} />
            </div>
          )}
          {error && (
            <div className="user-error" role="alert">
              <p>{error}</p>
              <button
                type="button"
                className="reload-button"
                disabled={loading}
                onClick={() => void fetchChannels()}
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && channels.size === 0 &&
            <p>No channels found.</p>
          }
          {channels.size > 0 && <ChannelList channels={channels} />}
        </>
      )}
      {channelView === 'creating' && <ChannelCreation />}
    </>
  )
}