import { useRef, useState } from 'react'
import { useDynamicInputSizing } from '../../hooks/useDynamicInputSizing.ts'
import type { UUID } from '@chappy/shared'
import { useCredentialStore } from '../../stores/credentialStore.ts'
import { dbPostChannelMessage } from '../../api/channels/postChannelMessage.ts'
import { useChannelsStore } from '../../stores/channelsStore.ts'

type InputProps = {
  channelId: UUID
}

export default function ChannelInput({ channelId }: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleInputSizing, resetInputSizing } = useDynamicInputSizing()

  const token = useCredentialStore(s => s.token)
  const setChannelMessage = useChannelsStore(s => s.setChannelMsg)

  const [input, setInput] = useState<string>('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    const message = await dbPostChannelMessage(channelId, input, token ?? null)
    if (message.state === 'success') {
      setChannelMessage(channelId, message.messageData)
      setInput('')
      resetInputSizing(textareaRef.current)
      return
    }

    console.log(message.status, message.message)
  }

  return (
    <form className="channel-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={input}
        onInput={handleInputSizing}
        onChange={e => setInput(e.currentTarget.value)}
      />
      <button type="submit" disabled={!input.trim()}>Send</button>
    </form>
  )
}