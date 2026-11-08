import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAiStore } from '../../../stores/aiStore.ts'
import { dbGetAiMetaData } from '../../../api/ai/getMetaData.ts'

export function useAllAiMeta() {
  const setAllMetaData = useAiStore(s => s.setAllAiMetaData)
  const setAiMetaFetchState = useAiStore(s => s.setAiMetaFetchState)
  const navigate = useNavigate()

  const fetchAllAiMeta = useCallback(async (token: string) => {
    if (!token) return
    const hasFetched = useAiStore.getState().hasFetchedAiMeta
    const loading = useAiStore.getState().loadingAiMeta

    if (hasFetched || loading) return

    setAiMetaFetchState({
      loadingAiMeta: true,
      errorAiMeta: null
    })

    try {
      const result = await dbGetAiMetaData(token)

      if (result.state === 'failed') {
        setAiMetaFetchState({ errorAiMeta: result.message })
        return
      }

      setAllMetaData(result.data)
      setAiMetaFetchState({ hasFetchedAiMeta: true })

    } catch (error) {
      setAiMetaFetchState({
        errorAiMeta: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setAiMetaFetchState({ loadingAiMeta: false })
    }

  }, [setAiMetaFetchState, setAllMetaData, navigate])

  return { fetchAllAiMeta }
}
