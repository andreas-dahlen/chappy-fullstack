import type { dbAiMetaSchema, dbAiSchema, dbChannelSchema, dbKeySchema, dbMetaConversationSchema, dbMsgSchema, dbUserSchema } from '../schemas/dbSchemas.ts';
import * as z from 'zod'

export type DbMetaConversation = z.infer<typeof dbMetaConversationSchema>

export type DbMessageData = z.infer<typeof dbMsgSchema>

export type DbUser = z.infer<typeof dbUserSchema>

export type DbChannel = z.infer<typeof dbChannelSchema>

export type DbKey = z.infer<typeof dbKeySchema>

export type DbAiMessage = z.infer<typeof dbAiSchema>

export type DbAiMeta = z.infer<typeof dbAiMetaSchema>