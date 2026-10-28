import { useEffect } from 'react'
import { useUsersStore } from '../stores/usersStore.ts'

export default function UserConversations() {
  const users = useUsersStore(s => s.activeUsers)
  const loading = useUsersStore(s => s.loading)
  const error = useUsersStore(s => s.error)
  const fetchUsers = useUsersStore(s => s.fetchUsers)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

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
    <section>
      <h2>Users</h2>

      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            {user.name}
          </li>
        ))}
      </ul>
    </section>
  )
}