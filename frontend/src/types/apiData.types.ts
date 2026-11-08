import type { AiMessage, AiMetaData, AiResponse, Auth, Channel, MessageData, User, UUID } from '@chappy/shared'

export type ApiSuccess = {
  state: 'success'
}
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

export type CreatedChannelReturn =
  | {
    state: 'success'
    channel: Channel
  } | ApiFailure

export type AuthReturn =
  | {
    state: 'success'
    authData: Auth
  } | ApiFailure

export type AuthSuccess = Extract<AuthReturn, { state: 'success' }>

export type ConversationStarterReturn =
  | {
    state: 'success'
    conversationId: UUID
  } | ApiFailure

export type ConversationParticipantReturn =
  | {
    state: 'success'
    participantId: UUID
  } | ApiFailure


export type MsgReturn =
  | {
    state: 'success'
    msgData: MessageData[]
  } | ApiFailure

export type MsgPostReturn =
  | {
    state: 'success'
    messageData: MessageData
  } | ApiFailure

export type SummaryReturn =
  | {
    state: 'success'
    data: AiResponse
  } | ApiFailure

export type AiMetaDataReturn =
  | {
    state: 'success'
    data: AiMetaData[]
  } | ApiFailure

export type PostAiMetaDataReturn =
  | {
    state: 'success'
    data: AiMetaData
  } | ApiFailure

export type AiMessageReturn =
  | {
    state: 'success'
    data: AiMessage[]
  } | ApiFailure

export type AuthNavigationState =
  | {
    reason: 'enter-channel'
    channelId: string
  }
  | {
    reason: 'start-conversation'
    participantId: string
  }
  | {
    reason: 'return-to'
    pathname: string
  }