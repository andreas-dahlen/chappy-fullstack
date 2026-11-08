import { useEffect, useRef, useState } from 'react'
import { useDynamicInputSizing } from '../../hooks/sideEffects/useDynamicInputSizing.ts'
import { SendHorizonal } from 'lucide-react'
import '../../styles/components/ai-input.css'

type ChatInputProps = {
  onSubmit: (message: string) => void
  loading: boolean
}
export default function ChatInput({
  onSubmit,
  loading
}: ChatInputProps) {
  const [input, setInput] = useState<string>('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleInputSizing, resetInputSizing } = useDynamicInputSizing()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const message = input.trim()
    if (!message) return

    onSubmit(message)
    setInput('')
  }

  useEffect(() => {
    if (input === '') {
      resetInputSizing(textareaRef.current)
    }

  }, [input, resetInputSizing])

  return (
    <form className="input-ai" onSubmit={handleSubmit}>
      <textarea
        rows={1}
        name="message"
        aria-label="Message"
        ref={textareaRef}
        value={input}
        placeholder='Ask a question...'
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
        disabled={!input.trim() || loading}
        className='send-button'
      >
        <SendHorizonal size={30} />
      </button>
    </form>
  )
}