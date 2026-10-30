import type { Channel, User } from '@chappy/shared'

export type UserReturn =
  | {
    state: 'success'
    users: User[]
  } | {
    state: 'failed'
    message: string
  }


export type ChannelReturn =
  | {
    state: 'success'
    channels: Channel[]
  } | {
    state: 'failed'
    message: string
  }

export type JwtReturn =
  | {
    state: 'success'
    token: string
    userId: string
    name: string
  } | {
    state: 'failed'
    message: string
  }

export type AuthNavigationState =
  | {
    reason: 'start-conversation'
    userId: string
  }
  | {
    reason: 'enter-channel'
    channelId: string
  }