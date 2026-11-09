import { useEffect, useState } from 'react'
import { useUsersStore } from '../../stores/usersStore.ts'
import '../../styles/aside/conversation.css'
import type { User, UUID } from '@chappy/shared'
import { useNavigate, useParams } from 'react-router'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { dbCreateOrGetConversation } from '../../api/conversations/createOrGetConversation.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'
import SidebarHeader from './SidebarHeader.tsx'
import { Loader } from 'lucide-react'

type ConversationError = {
  userId: UUID
  message: string
}

export default function Conversations() {
  const [conversationError, setConversationError] = useState<ConversationError | null>(null)
  const [conversationLoading, setConversationLoading] = useState<UUID | null>(null)

  const setConversationMetaData = useConversationStore(s => s.setConversationMetaData)

  const users = useUsersStore(s => s.users)
  const loading = useUsersStore(s => s.loading)
  const userError = useUsersStore(s => s.error)
  const hasFetchedUser = useUsersStore(s => s.hasFetchedUsers)
  const fetchUsers = useUsersStore(s => s.fetchUsers)

  const token = useCredentialStore(s => s.token)
  const userId = useCredentialStore(s => s.userId)

  const navigate = useNavigate()
  const { conversationId } = useParams()

  const activeParticipantId = useConversationStore(s =>
    conversationId
      ? s.conversationMetaData.get(conversationId)?.metaData?.participantId
      : undefined
  )

  const relevantUsers = [...users.values()].filter(user => user.userId !== userId)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const handleUserClick = async (user: User) => {
    setConversationError(null)

    if (!token) {
      navigate('/sign-in', {
        state: {
          reason: 'start-conversation',
          participantId: user.userId
        }
      })
      return
    }

    setConversationLoading(user.userId)

    try {
      const dbData = await dbCreateOrGetConversation(user.userId, token)

      if (dbData.state === 'failed') {
        setConversationError({
          userId: user.userId,
          message: dbData.message
        })
        return
      }

      setConversationMetaData(dbData.conversationId, {
        hasFetchedMeta: true,
        metaData: {
          participantId: user.userId,
          participantName: user.name
        }
      })

      navigate(`/conversations/${dbData.conversationId}`)

    } catch (error) {
      setConversationError({
        userId: user.userId,
        message: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setConversationLoading(null)
    }
  }

  return (
    <>
      <SidebarHeader title="Conversations" />

      {loading && relevantUsers.length === 0 && (
        <div className='placement'>
          <Loader className='loader' size={40}></Loader>
        </div>
      )}

      {userError && (
        <div className="user-error" role="alert">
          <p>{userError}</p>
          <button
            type="button"
            className="reload-button"
            disabled={loading}
            onClick={() => void fetchUsers()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !userError && relevantUsers.length === 0 && hasFetchedUser && (
        <p>No users found.</p>
      )}

      {relevantUsers.length > 0 && (
        <ul className="user-list">
          {relevantUsers.map(user => (
            <li key={user.userId} className="user-list-item">
              <button
                type="button"
                className={`user-button ${user.userId === activeParticipantId ? 'active' : ''}`}
                disabled={conversationLoading !== null}
                onClick={() => void handleUserClick(user)}
              >
                <span className="user-avatar" aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <span className="user-info">
                  <span className="user-name">{user.name}</span>
                </span>

                {conversationLoading === user.userId && (
                  <Loader className='loader' aria-label="Opening conversation"></Loader>
                )}
              </button>

              {conversationError?.userId === user.userId && (
                <p className="conversation-error" role="alert">
                  {conversationError.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}