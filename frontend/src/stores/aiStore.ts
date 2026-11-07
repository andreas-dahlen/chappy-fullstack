import type { UUID } from '@chappy/shared'
import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type AiStoreSummaryData = {
  summary: string | null
  loading: boolean
  error: string | null
}

// type PersistedAiStore = {
//   summaries: Record<UUID, Pick<AiStoreSummaryData, 'summary'>>
// }
type AiStore = {
  summaries: Map<UUID, AiStoreSummaryData>

  setSummaryData: (summaryId: UUID, data: Partial<AiStoreSummaryData>) => void
  removeSummaryData: (summaryId: UUID) => void
}

export const useAiStore = create<AiStore>()(
  // persist(
  immer(set => ({
    summaries: new Map(),

    setSummaryData: (summaryId, data) => {
      set(s => {
        const existing = s.summaries.get(summaryId)

        s.summaries.set(summaryId, {
          summary: null,
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