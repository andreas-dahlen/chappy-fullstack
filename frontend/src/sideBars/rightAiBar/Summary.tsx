import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAiSummary } from '../../hooks/ai/summary/useAiSummary.ts'
import { useAiStore } from '../../stores/aiStore.ts'
import { Loader } from 'lucide-react'
import '../../styles/aside/summary.css'
export default function Summary() {
  const { generateSummary } = useAiSummary()
  const params = useParams()

  const summaryId = params.conversationId ?? params.channelId

  const summaryData = useAiStore(s =>
    summaryId ? s.summaries.get(summaryId) : undefined
  )
  const loading = summaryData?.loading ?? false
  const error = summaryData?.error

  const summary =
    summaryData?.messageData?.message
    ?? (loading ? '' : 'A summary will be generated when messages are available.')

  const duration =
    summaryData?.messageData?.duration
    ?? ''

  useEffect(() => {
    if (!summaryId) return
    const type = params.conversationId ? 'conversation' : 'channel'
    void generateSummary({ type, id: summaryId })
  }, [summaryId, generateSummary])

  return (
    <div className='summary'>
      {!error && summaryId && <div className='summary-text'>{summary} {duration}</div>}
      {error && <p>{error}</p>}
      <div className='loading-reloading'>
        {loading && <Loader className='loader' size={50} />}
        {!loading && summaryId && <button
          className='reload-button'
          disabled={loading}
          type='button'
          onClick={() => generateSummary({
            type: params.conversationId
              ? 'conversation'
              : 'channel', id: summaryId,
          }, true)}
        >Reload</button>}
      </div>
      {!error && !summaryId && !loading && <div> nothing available to summarize yet. </div>}
    </div>
  )
}