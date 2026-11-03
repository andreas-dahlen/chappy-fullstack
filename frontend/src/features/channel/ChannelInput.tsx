import { useEffect, useRef, useState } from 'react'
import { useDynamicInputSizing } from '../../hooks/useDynamicInputSizing.ts'
import type { UUID } from '@chappy/shared'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { dbPostChannelMessage } from '../../api/channels/postChannelMessage.ts'
import { useChannelsStore } from '../../stores/channelsStore.ts'
import { SendHorizonal } from 'lucide-react'
import '../../styles/components/input.css'

type InputProps = {
  channelId: UUID
}

export default function ChannelInput({ channelId }: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleInputSizing, resetInputSizing } = useDynamicInputSizing()

  const token = useCredentialStore(s => s.token)
  const setChannelMessage = useChannelsStore(s => s.setChannelMsg)

  const [input, setInput] = useState<string>('')

  useEffect(() => {
    if (input === '') {
      resetInputSizing(textareaRef.current)
    }
  }, [input, resetInputSizing])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedInput = input.trim()

    if (!trimmedInput) return

    const message = await dbPostChannelMessage(channelId, trimmedInput, token ?? null)
    if (message.state === 'success') {
      setChannelMessage(channelId, message.messageData)
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