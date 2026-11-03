import { NavLink, useParams } from 'react-router'
import { useCredentialStore } from '../stores/credentialStore.ts'
import { useConversationMeta } from '../hooks/useConversationMeta.ts'
import { useEffect } from 'react'
import { useConversationStore } from '../stores/conversationStore.ts'
import ConversationMessages from '../features/conversation/ConversationMessages.tsx'
import ConversationInput from '../features/conversation/ConversationInput.tsx'
import '../styles/pages/conversation.css'

export default function Conversation() {

  const { conversationId } = useParams()

  // const [conversationMeta, setCnversationMeta] = useState<ConversationStoreMetaData | undefined>()

  const token = useCredentialStore(s => s.token)
  const { fetchConversationMeta } = useConversationMeta()


  const conversationMeta = useConversationStore(s =>
    conversationId
      ? s.conversationMetaData.get(conversationId)
      : undefined
  )

  useEffect(() => {
    if (!conversationId) return
    void fetchConversationMeta(conversationId)
  }, [conversationId, fetchConversationMeta])

  if (!conversationId) return (
    <div className='faulty-state'>
      <p>Ooops! Could not load the conversation</p>
      <NavLink to="/" replace>Home</NavLink>
    </div>
  ) //no error handling here... parent handles that for conversations...

  if (!token) {
    return (
      <div className='faulty-state'>
        <p>You need to sign in to enter conversation.</p>
        <NavLink to="/sign-in" replace>Sign in</NavLink>
      </div>
    )
  }

  //TODO use conversationMeta for error handling!

  return (
    <div className="conversation-page">
      <div className='conversation-header'>
        <p >
          {conversationMeta?.metaData?.participantName ?? 'Unknown user'}
        </p>
      </div>
      <div className="conversation-view">
        <ConversationMessages conversationId={conversationId} />
        <ConversationInput conversationId={conversationId} />
      </div>
    </div>
  )
}