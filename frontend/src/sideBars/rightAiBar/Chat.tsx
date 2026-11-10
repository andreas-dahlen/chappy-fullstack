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
import { Loader } from 'lucide-react';
import DeletionPopup from './DeletionPopup.tsx';

export default function Chat() {

  const { fetchAllAiMeta } = useAllAiMeta()
  const token = useCredentialStore(s => s.token)
  const setAiMetaData = useAiStore(s => s.setAiMetaData)
  const setAiMessage = useAiStore(s => s.setAiMessage)

  const [selected, setSelected] = useState<UUID | null>(null)

  const errorAiMeta = useAiStore(s => s.errorAiMeta)
  const loadingAiMeta = useAiStore(s => s.loadingAiMeta)

  const [confirmDeletion, setConfirmDeletion] = useState<UUID | null>(null)
  const loadingAiMessage = useAiStore(s =>
    selected ? s.aiMessageData.get(selected)?.loading : undefined)
  const errorAiMessage = useAiStore(s =>
    selected ? s.aiMessageData.get(selected)?.error : undefined)

  const setAiMetaState = useAiStore(s => s.setAiMetaFetchState)
  const setAiMessageData = useAiStore(s => s.setAiMessageData)

  const onSubmit = async (message: string) => {
    if (!token) return

    let resolvedAiId = selected
    try {
      if (!selected) {
        setAiMetaState({ errorAiMeta: null, loadingAiMeta: true })
        const chatName = message.slice(0, 40)
        const result = await dbPostAiMetaData(chatName, token)

        if (result.state === 'failed') {
          setAiMetaState({ errorAiMeta: result.message })
          return
        }
        setAiMetaData(result.data)
        resolvedAiId = result.data.aiId
        setSelected(resolvedAiId)
      }
      if (!resolvedAiId) return
      setAiMessageData(resolvedAiId, { loading: true, error: null })
      const result = await dbPostAiMessage(resolvedAiId, message, token)

      if (result.state === 'failed') {
        setAiMessageData(resolvedAiId, { error: result.message })
        return
      }

      for (const message of result.data) {
        setAiMessage(resolvedAiId, message)
      }

    } finally {
      setAiMetaState({ loadingAiMeta: false })
      if (resolvedAiId) {
        setAiMessageData(resolvedAiId, { loading: false })
      }
    }
  }


  useEffect(() => {
    if (!token) return
    void fetchAllAiMeta(token)
  }, [fetchAllAiMeta, token])

  if (!token) {
    return (<div className='ai-chat'><p className='auth-required'>
      Need to sign in to use this feature.
    </p>
    </div>)
  }

  return (
    <div className='ai-chat'>
      <SelectionPanel
        selected={selected}
        setSelected={setSelected}
        setConfirmDeletion={setConfirmDeletion}
      />
      {loadingAiMeta &&
        <Loader className="loader" size={50} />
      }

      <p className="ai-error">{errorAiMeta}</p>

      <div className='deletion-box'>
        <DeletionPopup
          selected={selected}
          setSelected={setSelected}
          setConfirmDeletion={setConfirmDeletion}
          confirmDeletion={confirmDeletion}
        />
      </div>

      <div className='ai-message-box'>
        {selected && <ChatMessages selected={selected} />}
      </div>
      {!loadingAiMeta && loadingAiMessage && <Loader className='loader' size={30} />}
      <p className="ai-error">{errorAiMessage}</p>
      <ChatInput
        onSubmit={onSubmit}
        loading={loadingAiMeta || Boolean(loadingAiMessage)}
      />
    </div>
  )
}

// Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum nesciunt, nostrum, temporibus porro perferendis neque ut ad ipsam exercitationem, deserunt perspiciatis magni harum voluptatum consequatur tempore distinctio totam laudantium saepe. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim aliquid magnam ad sed dolore, suscipit, placeat ratione id laudantium qui dolorum accusamus, neque fugit praesentium odit repellat harum eos libero! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, mollitia. Minus dolor, iure, voluptatibus distinctio quo molestias quam tenetur fugit iste laudantium blanditiis commodi nemo earum delectus quibusdam nesciunt expedita? Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quam ipsa quod voluptatem adipisci dignissimos eum facilis amet, maxime perspiciatis fugiat numquam nam quos dolorem culpa aspernatur ut pariatur animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo autem fuga eligendi assumenda aliquam pariatur animi dolores aut accusamus, quisquam fugit suscipit molestiae dicta doloremque ex voluptatem sit ipsam debitis! Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repellat sequi recusandae reiciendis at, fugiat suscipit sint repudiandae, molestias maxime ratione aliquam harum eveniet, optio sed fuga pariatur delectus nihil.