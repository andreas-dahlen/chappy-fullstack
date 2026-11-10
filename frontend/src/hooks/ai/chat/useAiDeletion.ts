import { useCallback } from 'react';
import type { UUID } from '@chappy/shared';
import { useCredentialStore } from '../../../stores/credentialStore.ts';
import { useAiStore } from '../../../stores/aiStore.ts';
import { dbDeleteAiChat } from '../../../api/ai/deleteChat.ts';

export function useAiChatDeletion() {
  const token = useCredentialStore(s => s.token)
  const removeAiChat = useAiStore(s => s.removeAiChat)
  const setAiMessageData = useAiStore(s => s.setAiMessageData)

  const deleteAiChat = useCallback(async (aiId: UUID): Promise<boolean> => {
    const { aiMetaData, loadingAiMeta } = useAiStore.getState()
    const metaData = aiMetaData.get(aiId)

    if (!metaData || !token || loadingAiMeta) return false

    setAiMessageData(aiId, { loading: true, error: null })
    try {
      const result = await dbDeleteAiChat(aiId, token)

      if (result.state === 'failed') {
        setAiMessageData(aiId, { error: result.message })
        return false
      }

      removeAiChat(aiId)
      // if (displayedId === aiId) {
      //   setDisplayed(null)
      // }
      return true
    } catch (error) {
      setAiMessageData(aiId, {
        error: error instanceof Error
          ? error.message
          : String(error)
      })
      return false
    } finally {
      if (useAiStore.getState().aiMessageData.has(aiId)) {
        setAiMessageData(aiId, { loading: false })
      }
    }
  }, [token, removeAiChat, setAiMessageData])

  return { deleteAiChat }
}