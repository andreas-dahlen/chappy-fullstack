import { useCallback } from 'react'
import { useChannelsStore } from '../../stores/channelsStore.ts'
import { dbGetChannels } from '../../api/channels/getChannels.ts'

export function useChannels() {
  const setChannels = useChannelsStore(s => s.setChannels)
  const setHasFetchedChannels = useChannelsStore(s => s.setHasFetchedChannels)
  const setLoading = useChannelsStore(s => s.setLoading)
  const setError = useChannelsStore(s => s.setError)

  const fetchChannels = useCallback(async (): Promise<boolean> => {
    const hasFetched = useChannelsStore.getState().hasFetchedChannels
    const loading = useChannelsStore.getState().loading

    if (hasFetched || loading) return false

    setLoading(true)
    setError(null)

    try {
      const result = await dbGetChannels()

      if (result.state === 'failed') {
        setError(result.message)
        return false
      }

      setChannels(result.channels)
      setHasFetchedChannels(true)

      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
      return false
    } finally {
      setLoading(false)
    }
  }, [setChannels, setHasFetchedChannels, setLoading, setError])

  return { fetchChannels }
}