import type { User } from '@chappy/shared'

export type UserReturn =
  | {
    state: 'success'
    users: User[]
  } | {
    state: 'failed'
    message: string
  }