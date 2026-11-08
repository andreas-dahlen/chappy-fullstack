import { useNavigate, useParams } from 'react-router';
import { useCredentialStore } from '../../stores/credentialStore.ts';
import { useChannelsStore } from '../../stores/channelsStore.ts';
import { useCallback } from 'react';
import type { UUID } from '@chappy/shared';
import { dbDeleteChannel } from '../../api/channels/deleteChannel.ts';

export function useChannelDeletion() {
  const token = useCredentialStore(s => s.token)
  const navigate = useNavigate()
  const removeChannel = useChannelsStore(s => s.removeChannel)
  const setChannelData = useChannelsStore(s => s.setChannelData)
  const { channelId } = useParams()

  const deleteChannel = useCallback(async (chanId: UUID) => {
    const { channels } = useChannelsStore.getState()
    const { userId } = useCredentialStore.getState()
    const channelData = channels.get(chanId)
    if (!channelData) return
    if (channelData.channel.createdBy !== userId || !token) return
    if (channelData.loading) return

    setChannelData(chanId, { loading: true, error: null })
    try {
      const result = await dbDeleteChannel(chanId, token)

      if (result.state === 'failed') {
        setChannelData(chanId, { error: result.message })
        return
      }

      removeChannel(chanId)
      if (channelId === chanId) {
        navigate('/', { replace: true })
      }

    } catch (error) {
      setChannelData(chanId, {
        error: error instanceof Error
          ? error.message
          : String(error)
      })
      return
    } finally {
      if (useChannelsStore.getState().channels.has(chanId)) {
        setChannelData(chanId, { loading: false })
      }
    }
  }, [token, channelId, navigate, removeChannel, setChannelData])

  return { deleteChannel }
}