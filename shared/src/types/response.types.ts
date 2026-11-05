import type z from 'zod'
import { channelCreationSchema, dbChannelSchema, dbKeySchema, dbMetaConversationSchema, dbMsgSchema, dbUserSchema, messageStringSchema, uuidSchema } from '../schemas/dbSchemas.ts'
import type { authResponseSchema, channelMsgSchema, channelSchema, conversationMsgSchema, conversationSchema, participantSchema } from '../schemas/frontendSchemas.ts'

export type UUID = z.infer<typeof uuidSchema>
export type User = {
  name: string
  userId: UUID
}

export type DbUser = z.infer<typeof dbUserSchema>

export type DbChannel = z.infer<typeof dbChannelSchema>

export type Channel = z.infer<typeof channelSchema>

export type Auth = z.infer<typeof authResponseSchema>

export type DbMessageData = z.infer<typeof dbMsgSchema>

export type MessageData =
  | z.infer<typeof channelMsgSchema>
  | z.infer<typeof conversationMsgSchema>

export type Message = z.infer<typeof messageStringSchema>

export type Conversation = z.infer<typeof conversationSchema>

export type Participant = z.infer<typeof participantSchema>

export type DbMetaConversation = z.infer<typeof dbMetaConversationSchema>

export type DbKey = z.infer<typeof dbKeySchema>

export type ChannelCreation = z.infer<typeof channelCreationSchema>