import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

export type DbCredentials = {
  ownerId: string
  name: string
  username: string
  hashPassword: string
}

export type ChannelIdParam = {
  channelId: string
}

export type ParticipantParam = {
  participantId: string
}

export type ConversationIdParam = {
  conversationId: string
}

export type BatchWriteItems = NonNullable<
  NonNullable<BatchWriteCommandInput['RequestItems']>[string]>