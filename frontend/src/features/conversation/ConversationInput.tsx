import type { UUID } from '@chappy/shared';
import { useEffect, useRef, useState } from 'react';
import { useDynamicInputSizing } from '../../hooks/sideEffects/useDynamicInputSizing.ts';
import { useCredentialStore } from '../../stores/credentialStore.ts';
import { useConversationStore } from '../../stores/conversationStore.ts';
import { SendHorizonal } from 'lucide-react';
import '../../styles/components/input.css'
import { dbPostConversationMessage } from '../../api/conversations/postConversationMessage.ts';
type ConversationInputProps = {
  conversationId: UUID
}

export default function ConversationInput({
  conversationId }: ConversationInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleInputSizing, resetInputSizing } = useDynamicInputSizing()

  const token = useCredentialStore(s => s.token)
  const setConversationMessage = useConversationStore(s => s.setConversationMsg)

  const [input, setInput] = useState<string>('')

  useEffect(() => {
    if (input === '') {
      resetInputSizing(textareaRef.current)
    }
  }, [input, resetInputSizing])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedInput = input.trim()

    if (!trimmedInput || !token) return

    const message = await dbPostConversationMessage(conversationId, trimmedInput, token)
    if (message.state === 'success') {
      setConversationMessage(conversationId, message.messageData)
      setInput('')
      return
    }
  }
  return (
    <form className="input" onSubmit={handleSubmit}>
      <textarea
        rows={1}
        name="message"
        aria-label="Message"
        ref={textareaRef}
        value={input}
        placeholder='Write a message...'
        onInput={handleInputSizing}
        onChange={e => setInput(e.currentTarget.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />

      <button
        type="submit"
        disabled={!input.trim()}
        className='send-button'
      >
        <SendHorizonal size={30} />
      </button>
    </form>
  )
}