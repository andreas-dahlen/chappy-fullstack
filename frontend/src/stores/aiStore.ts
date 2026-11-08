import type { AiMessage, AiMetaData, AiResponse, UUID } from '@chappy/shared'
import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type AiStoreSummaryData = {
  messageData: AiResponse | null
  loading: boolean
  error: string | null
}

export type AiStoreMetaData = {
  metaData: AiMetaData
}

export type AiStoreMessageData = {
  messageData: Map<UUID, AiMessage>
  hasFetchedMsgs: boolean
  loading: boolean
  error: string | null
}

type UpdateAiState = {
  hasFetchedAiMeta?: boolean
  loadingAiMeta?: boolean
  errorAiMeta?: string | null
}

// type PersistedAiStore = {
//   summaries: Record<UUID, Pick<AiStoreSummaryData, 'summary'>>
// }
type AiStore = {
  summaries: Map<UUID, AiStoreSummaryData>
  setSummaryData: (summaryId: UUID, data: Partial<AiStoreSummaryData>) => void
  removeSummaryData: (summaryId: UUID) => void

  aiMetaData: Map<UUID, AiStoreMetaData>

  hasFetchedAiMeta: boolean
  loadingAiMeta: boolean
  errorAiMeta: string | null

  setAiMetaFetchState: (data: UpdateAiState) => void

  setAllAiMetaData: (data: AiMetaData[]) => void

  setAiMetaData: (data: AiMetaData) => void

  aiMessageData: Map<UUID, AiStoreMessageData>
  setAiMessageData: (
    aiId: UUID,
    data: Partial<AiStoreMessageData>
  ) => void
  setAiMessage: (aiId: UUID, data: AiMessage) => void
}

export const useAiStore = create<AiStore>()(
  // persist(
  immer(set => ({
    summaries: new Map(),

    setSummaryData: (summaryId, data) => {
      set(s => {
        const existing = s.summaries.get(summaryId)

        s.summaries.set(summaryId, {
          messageData: null,
          loading: false,
          error: null,
          ...existing,
          ...data
        })
      })
    },
    removeSummaryData: (summaryId) => {
      set(s => {
        s.summaries.delete(summaryId)
      })
    },

    aiMetaData: new Map(),

    hasFetchedAiMeta: false,
    loadingAiMeta: false,
    errorAiMeta: null,

    setAllAiMetaData(data) {
      set(s => {
        s.aiMetaData = new Map(
          data.map(entry => [
            entry.aiId,
            {
              metaData: entry,
            }
          ])
        )
      })
    },

    setAiMetaData: (metaData) => {
      set(s => {
        s.aiMetaData.set(metaData.aiId, { metaData })
      })
    },

    setAiMetaFetchState: data => {
      set(s => {
        if (data.hasFetchedAiMeta !== undefined) {
          s.hasFetchedAiMeta = data.hasFetchedAiMeta
        }

        if (data.loadingAiMeta !== undefined) {
          s.loadingAiMeta = data.loadingAiMeta
        }

        if (data.errorAiMeta !== undefined) {
          s.errorAiMeta = data.errorAiMeta
        }
      })
    },

    aiMessageData: new Map(),

    setAiMessageData: (aiId, data) => {
      set(s => {
        const existing = s.aiMessageData.get(aiId)

        s.aiMessageData.set(aiId, {
          hasFetchedMsgs: false,
          loading: false,
          error: null,
          messageData: new Map(),
          ...existing,
          ...data
        })
      })
    },

    setAiMessage: (aiId, data) => {
      set(s => {
        const existing = s.aiMessageData.get(aiId)

        if (!existing) return

        existing.messageData.set(data.messageId, data)
      })
    }
  })),
  // {
  //   name: 'chappy-summaries',
  //   storage: createJSONStorage(() => localStorage),

  //   partialize: state => ({
  //     summaries: Object.fromEntries(
  //       [...state.summaries].map(([id, data]) => [
  //         id,
  //         { summary: data.summary }
  //       ])
  //     )
  //   }),
  //   merge: (persistedState, currentState) => {
  //     const persisted = persistedState as PersistedAiStore

  //     return {
  //       ...currentState,
  //       summaries: new Map(
  //         Object.entries(persisted.summaries ?? {}).map(([id, data]) => [
  //           id,
  //           {
  //             summary: data.summary,
  //             loading: false,
  //             error: null
  //           }
  //         ])
  //       )
  //     }
  //   }
  // }
  // )
)