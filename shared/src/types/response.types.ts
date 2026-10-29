import type z from 'zod'
import { dbChannelSchema, dbUserSchema, uuidSchema } from '../schemas/dbSchemas.ts'
import type { channelSchema } from '../schemas/frontendSchemas.ts'

export type UUID = z.infer<typeof uuidSchema>
export type User = {
  name: string
  userId: UUID
}

export type DbUser = z.infer<typeof dbUserSchema>

export type DbChannel = z.infer<typeof dbChannelSchema>

export type Channel = z.infer<typeof channelSchema>