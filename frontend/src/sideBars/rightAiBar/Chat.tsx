import { useEffect, useState } from 'react';
import { useAllAiMeta } from '../../hooks/ai/chat/useAllAiMetaData.ts';
import { useCredentialStore } from '../../stores/credentialStore.ts';
import ChatInput from './ChatInput.tsx';
import '../../styles/aside/ai-chat.css'
import ChatMessages from './ChatMessages.tsx';
import type { UUID } from '@chappy/shared';
import SelectionPanel from './SelectionPanel.tsx';
import { dbPostAiMessage } from '../../api/ai/postAiMessage.ts';
import { dbPostAiMetaData } from '../../api/ai/postMetaData.ts';
import { useAiStore } from '../../stores/aiStore.ts';

export default function Chat() {

  const { fetchAllAiMeta } = useAllAiMeta()
  const token = useCredentialStore(s => s.token)
  const setAiMetaData = useAiStore(s => s.setAiMetaData)
  const setAiMessage = useAiStore(s => s.setAiMessage)

  const [selected, setSelected] = useState<UUID | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (message: string) => {
    if (!token) return

    try {
      let resolvedAiId = selected
      setError(null)
      setLoading(true)
      if (!selected) {
        const chatName = message.slice(0, 10)
        const result = await dbPostAiMetaData(chatName, token)

        if (result.state === 'failed') {
          setError(result.message)
          return
        }
        setAiMetaData(result.data)
        resolvedAiId = result.data.aiId
        setSelected(resolvedAiId)
      }
      if (!resolvedAiId) return

      const result = await dbPostAiMessage(resolvedAiId, message, token)

      if (result.state === 'failed') {
        setError(result.message)
        return
      }

      result.data.forEach(message => {
        setAiMessage(resolvedAiId, message)
      })

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (!token) return
    void fetchAllAiMeta(token)
  }, [fetchAllAiMeta, token])

  if (!token) { return (<div className='ai-chat'>need to sign in to use this feature</div>) }

  return (
    <div className='ai-chat'>
      <SelectionPanel selected={selected} setSelected={setSelected} />
      <div className='ai-message-box'>
        {selected && <ChatMessages selected={selected} />}
      </div>
      <ChatInput
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  )
}

// Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum nesciunt, nostrum, temporibus porro perferendis neque ut ad ipsam exercitationem, deserunt perspiciatis magni harum voluptatum consequatur tempore distinctio totam laudantium saepe. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim aliquid magnam ad sed dolore, suscipit, placeat ratione id laudantium qui dolorum accusamus, neque fugit praesentium odit repellat harum eos libero! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, mollitia. Minus dolor, iure, voluptatibus distinctio quo molestias quam tenetur fugit iste laudantium blanditiis commodi nemo earum delectus quibusdam nesciunt expedita? Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quam ipsa quod voluptatem adipisci dignissimos eum facilis amet, maxime perspiciatis fugiat numquam nam quos dolorem culpa aspernatur ut pariatur animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo autem fuga eligendi assumenda aliquam pariatur animi dolores aut accusamus, quisquam fugit suscipit molestiae dicta doloremque ex voluptatem sit ipsam debitis! Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repellat sequi recusandae reiciendis at, fugiat suscipit sint repudiandae, molestias maxime ratione aliquam harum eveniet, optio sed fuga pariatur delectus nihil.