import { useEffect } from 'react'
import type { UUID } from '@chappy/shared'
import { socket } from '../../socket/socket.ts'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { useConversationStore } from '../../stores/conversationStore.ts'

export function useSocket() {
  const token = useCredentialStore(s => s.token)

  useEffect(() => {
    const handleConversationMessage = ({ conversationId }: { conversationId: UUID }) => {
      useConversationStore.getState().setConversationMsgData(conversationId, {
        hasFetchedMsgs: false
      })
    }

    socket.on('conversation:message', handleConversationMessage)

    return () => {
      socket.off('conversation:message', handleConversationMessage)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      socket.disconnect()
      return
    }

    socket.auth = { token }
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [token])
}