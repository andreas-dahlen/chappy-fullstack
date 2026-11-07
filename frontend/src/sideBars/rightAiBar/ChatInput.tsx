import { useEffect, useRef, useState } from 'react'
import { useDynamicInputSizing } from '../../hooks/useDynamicInputSizing.ts'
import { SendHorizonal } from 'lucide-react'
import '../../styles/components/ai-input.css'

export default function ChatInput() {
  const [input, setInput] = useState<string>('')
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => { }
  const { handleInputSizing, resetInputSizing } = useDynamicInputSizing()

  useEffect(() => {
    if (input === '') {
      resetInputSizing(textareaRef.current)
    }

  }, [input, resetInputSizing])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        disabled={!input.trim()}
        className='send-button'
      >
        <SendHorizonal size={30} />
      </button>
    </form>
  )
}