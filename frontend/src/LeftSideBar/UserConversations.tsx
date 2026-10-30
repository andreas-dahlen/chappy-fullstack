import { useEffect } from 'react'
import { useUsersStore } from '../stores/usersStore.ts'
import '../styles/aside/conversation.css'
import type { User } from '@chappy/shared'
import { useNavigate } from 'react-router'

export default function UserConversations() {
  const users = useUsersStore(s => s.activeUsers)
  const loading = useUsersStore(s => s.loading)
  const error = useUsersStore(s => s.error)
  const fetchUsers = useUsersStore(s => s.fetchUsers)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const navigate = useNavigate()

  // const conversations = useConversationsStore(s => s.conversations)
  // const location = useLocation()
  // const isActive =
  //   location.pathname === `/conversations/${conversation.conversationId}`

  const handleUserClick = async (user: User) => {
    // TODO: Fetch or create a conversation with this user. 
    // 
    // If unauthenticated, navigate to login. 
    // 
    // Preserve the intended recipient for after authentication. 
    // // Otherwise, navigate to the conversation.

    void navigate('/sign-in', {
      state: {
        reason: 'start-conversation',
        userId: user.userId
      }
    })
  }



  if (loading && users.length === 0) {
    return <p>Loading users...</p>
  }
  if (error) {
    return <p>Failed to load users: {error}</p>
  }
  if (users.length === 0) {
    return <p>No users found.</p>
  }
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.userId} className="user-list-item">
          <button
            type="button"
            className="user-button"
            onClick={() => handleUserClick(user)}
          >
            <span className="user-avatar" aria-hidden="true">
              {user.name.charAt(0).toUpperCase()}
            </span>

            <span className="user-info">
              <span className="user-name">{user.name}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}