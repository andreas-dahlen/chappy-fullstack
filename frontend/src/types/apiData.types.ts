import type { Auth, Channel, MessageData, User } from '@chappy/shared'
export type ApiFailure = {
  state: 'failed'
  message: string
  status: number | null
}
export type UserReturn =
  | {
    state: 'success'
    users: User[]
  } | ApiFailure


export type ChannelReturn =
  | {
    state: 'success'
    channels: Channel[]
  } | ApiFailure

export type AuthReturn =
  | {
    state: 'success'
    authData: Auth
  } | ApiFailure

export type ChannelMsgReturn =
  | {
    state: 'success'
    ChannelMsgData: MessageData[]
  } | ApiFailure

export type AuthSuccess = Extract<AuthReturn, { state: 'success' }>

export type AuthNavigationState =
  | {
    reason: 'enter-channel'
    channelId: string
  }
  | {
    reason: 'start-conversation'
    userId: string
  }
  | {
    reason: 'return-to'
    pathname: string
  }