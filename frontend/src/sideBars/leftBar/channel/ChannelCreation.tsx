import type { ChannelCreationInput } from '@chappy/shared'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { dbPostChannelCreation } from '../../../api/channels/postChannelCreation.ts'
import { useCredentialStore } from '../../../stores/credentialStore.ts'
import { useChannelsStore } from '../../../stores/channelsStore.ts'
import '../../../styles/aside/channel-creation.css'
import { useNavigate } from 'react-router'
import type { ChannelView } from './Channels.tsx'

type ChannelCreationProps = {
  setChannelView: React.Dispatch<React.SetStateAction<ChannelView>>
}
export default function ChannelCreation({ setChannelView }: ChannelCreationProps) {

  const token = useCredentialStore(s => s.token)
  const setChannel = useChannelsStore(s => s.setChannel)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [input, setInput] = useState<ChannelCreationInput>({ name: '', authRequired: false })
  const navigate = useNavigate()

  const handleCreation = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setLoading(true)

    try {
      const data = await dbPostChannelCreation(input, token)
      if (data.state === 'failed') {
        setError(data.message)
        return
      }

      setChannel(data.channel)
      navigate(`/channels/${data.channel.channelId}`)
      setChannelView('list')

    } finally { //catch already handled
      setLoading(false)
    }
  }

  return (
    <div className='form-box-side-panel'>

      <form className='form'
        onSubmit={handleCreation}
      >

        <label htmlFor="name">Channel name</label>
        <input
          id="name"
          type="text"
          required
          value={input.name}
          disabled={loading}
          onChange={e => setInput(prev => ({ ...prev, name: e.target.value }))}
        />

        <fieldset className="visibility-options" disabled={loading}>
          <legend className='sr-only'>Visibility</legend>


          <label className="visibility-option">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={input.authRequired === false}
              onChange={() => setInput(prev => ({ ...prev, authRequired: false }))}
            />
            <div className='creation-radio'>
              <span>Public</span>
              <p>Anyone can join</p>
            </div>
          </label>

          <label className="visibility-option">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={input.authRequired === true}
              onChange={() => setInput(prev => ({ ...prev, authRequired: true }))}
            />
            <div className='creation-radio'>
              <span>Private</span>
              <p>Sign in required</p>
            </div>
          </label>
        </fieldset>
        <div className='state-display'>
          {loading
            ? <span role="status" aria-label="Creation loading">
              <Loader className="loader" aria-hidden="true" />
            </span>
            : error && <p role="alert">{error}</p>
          }
        </div>
        <button type="submit"
          disabled={loading}
          className='submit-button'>
          {loading ? 'Loading...' : 'Create channel'}
        </button>
      </form>
    </div>
  )
}