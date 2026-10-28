import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type AppStore = {
  iconColor: string
}

export const useAppStore = create<AppStore>()(
  immer(() => ({
    iconColor: "rgb(223, 228, 199)",
  }))
)
