import * as z from 'zod'

export const uuidSchema = z.uuid()

export const dbKeySchema = z.object({
  pk: z.string().min(1),
  sk: z.string().min(1)
}).strict()
export const dbKeyArraySchema = z.array(dbKeySchema)

export const dbUserSchema = dbKeySchema.extend({
  name: z.string().min(1),
  ownerId: z.uuid(),
  hashPassword: z.string().min(1)
}).strict()
export const dbUserArraySchema = z.array(dbUserSchema)

export const dbChannelSchema = dbKeySchema.extend({
  name: z.string().min(1),
  ownerId: z.uuid(),
  authRequired: z.boolean(),
  timestamp: z.iso.datetime()
}).strict()
export const dbChannelArraySchema = z.array(dbChannelSchema)

export const dbMsgSchema = dbKeySchema.extend({
  ownerId: z.string().min(1),
  message: z.string().min(1),
  messageId: z.uuid(),
  timestamp: z.iso.datetime()
}).strict()
export const dbMsgArraySchema = z.array(dbMsgSchema)

export const dbMetaConversationSchema = dbKeySchema.extend({
  participants: z.array(z.uuid())
}).strict()
export const dbMetaConvoArraySchema = z.array(dbMetaConversationSchema)

export const dbAiMetaSchema = dbKeySchema.extend({
  name: z.string().min(1),
  timestamp: z.iso.datetime()
}).strict()

export const dbAiMetaArraySchema = z.array(dbAiMetaSchema)

export const dbAiSchema = dbKeySchema.extend({
  role: z.enum(['user', 'model']),
  message: z.string().min(1),
  messageId: z.uuid(),
  timestamp: z.iso.datetime()
}).strict()
export const dbAiArraySchema = z.array(dbAiSchema)