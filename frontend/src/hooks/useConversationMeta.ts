import { useCallback } from 'react'
import type { UUID } from '@chappy/shared'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { useConversationStore } from '../stores/conversationStore.ts'
import { dbGetConversationParticipant } from '../api/conversations/getConversationParticipant.ts'
import { useUsersStore } from '../stores/usersStore.ts'
import { useNavigate } from 'react-router'

export function useConversationMeta() {
  const token = useCredentialStore(s => s.token)
  const setConversationMetaData = useConversationStore(s => s.setConversationMetaData)
  const fetchUsers = useUsersStore(s => s.fetchUsers)
  const navigate = useNavigate()

  const fetchConversationMeta = useCallback(async (conversationId: UUID) => {
    if (!token) return
    const convoMeta = useConversationStore.getState().conversationMetaData
    const metaData = convoMeta.get(conversationId)

    if (metaData?.hasFetchedMeta || metaData?.loading) return

    setConversationMetaData(conversationId, {
      loading: true,
      error: null
    })

    try {
      const result = await dbGetConversationParticipant(conversationId, token)

      if (result.state === 'failed') {
        if (result.status === 403 &&
          useCredentialStore.getState().token === token) {
          navigate('/', { replace: true })
          return
        }
        setConversationMetaData(conversationId, { error: result.message })
        return
      }

      let savedUser = useUsersStore.getState().activeUsers.find(user => user.userId === result.participantId)

      if (!savedUser) {
        if (!useUsersStore.getState().hasFetchedUsers) {
          await fetchUsers()
        }
        savedUser = useUsersStore.getState().activeUsers.find(user => user.userId === result.participantId)
      }

      if (!savedUser) throw new Error('could not find User in database. Is the URL correct?')

      setConversationMetaData(conversationId, {
        metaData: {
          participantId: result.participantId,
          participantName: savedUser.name
        },
        hasFetchedMeta: true
      })
    } catch (error) {
      setConversationMetaData(conversationId, {
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setConversationMetaData(conversationId, { loading: false })
    }

  }, [token, setConversationMetaData, fetchUsers, navigate])

  return { fetchConversationMeta }
}
