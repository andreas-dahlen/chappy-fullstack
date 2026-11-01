import type z from 'zod'
import { dbChannelMsgSchema, dbChannelSchema, dbUserSchema, messageStringSchema, uuidSchema } from '../schemas/dbSchemas.ts'
import type { authResponseSchema, channelMsgSchema, channelSchema } from '../schemas/frontendSchemas.ts'

export type UUID = z.infer<typeof uuidSchema>
export type User = {
  name: string
  userId: UUID
}

export type DbUser = z.infer<typeof dbUserSchema>

export type DbChannel = z.infer<typeof dbChannelSchema>

export type Channel = z.infer<typeof channelSchema>

export type Auth = z.infer<typeof authResponseSchema>

export type DbMessageData = z.infer<typeof dbChannelMsgSchema>

export type MessageData = z.infer<typeof channelMsgSchema>

export type Message = z.infer<typeof messageStringSchema>