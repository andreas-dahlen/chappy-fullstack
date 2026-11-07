import { useEffect, useState } from 'react'
import { useUsersStore } from '../../stores/usersStore.ts'
import '../../styles/aside/conversation.css'
import type { User, UUID } from '@chappy/shared'
import { useNavigate, useParams } from 'react-router'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { dbCreateOrGetConversation } from '../../api/conversations/createOrGetConversation.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'
import SidebarHeader from './SidebarHeader.tsx'

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
  const fetchUsers = useUsersStore(s => s.fetchUsers)
  const token = useCredentialStore(s => s.token)
  const userId = useCredentialStore(s => s.userId)
  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const navigate = useNavigate()
  const { conversationId } = useParams()

  const activeParticipantId = useConversationStore(s =>
    conversationId
      ? s.conversationMetaData.get(conversationId)?.metaData?.participantId
      : undefined
  )
  const resolveActive = (userId: UUID) => {
    return userId === activeParticipantId ? 'active' : ''
  }

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

      if (dbData.state === 'success') {
        setConversationMetaData(dbData.conversationId, {
          hasFetchedMeta: true,
          metaData: {
            participantId: user.userId,
            participantName: user.name
          }
        })
        navigate(`/conversations/${dbData.conversationId}`)
        return
      }
      setConversationError({ userId: user.userId, message: dbData.message })
    } finally {
      setConversationLoading(null)
    }
  }



  const relevantUsers = [...users.values()].filter(user => user.userId !== userId)

  if (loading && relevantUsers.length === 0) {
    return <p>Loading users...</p> //TODO will use a rotating thingie <3<3
  }
  if (userError) {
    return <p>{userError}</p>
  }
  if (relevantUsers.length === 0) {
    return <p>No users found.</p>
  }
  return (
    <>
      <SidebarHeader title={'Conversations'} />
      <ul className="user-list">
        {relevantUsers.map((user) => (
          <li key={user.userId} className="user-list-item">
            <button
              type="button"
              className={`user-button ${resolveActive(user.userId)}`}
              disabled={conversationLoading !== null}
              onClick={() => handleUserClick(user)}
            >
              <span className="user-avatar" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </span>

              <span className="user-info">
                <span className="user-name">{user.name}</span>
              </span>

              {conversationLoading === user.userId && <div className='??'>loading</div>}
            </button>
            {conversationError?.userId === user.userId && <div role="alert">{conversationError.message}</div>}
          </li>
        ))}
      </ul>
    </>
  )
}