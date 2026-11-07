import * as z from 'zod'

export const resUserSchema = z.object({
  name: z.string(),
  userId: z.uuid()
}).strict()
export const resUserArraySchema = z.array(resUserSchema)

export const resChannelSchema = z.object({
  channelId: z.uuid(),
  channelName: z.string().min(1),
  createdBy: z.uuid(),
  authRequired: z.boolean(),
  createdAt: z.iso.datetime()
}).strict()
export const resChannelArraySchema = z.array(resChannelSchema)

export const resAuthSchema = z.object({
  token: z.string().min(1),
  userId: z.uuid(),
  name: z.string()
}).strict()

const resMsgSchema = z.object({
  message: z.string().min(1),
  messageId: z.uuid(),
  createdAt: z.iso.datetime()
}).strict()

export const resChannelMsgSchema = resMsgSchema.extend({
  createdBy: z.uuid().or(z.literal('guest'))
})
export const resConversationMsgSchema = resMsgSchema.extend({
  createdBy: z.uuid()
})
export const resChannelMsgArraySchema = z.array(resChannelMsgSchema)
export const resConversationMsgArraySchema = z.array(resConversationMsgSchema)

export const resConversationSchema = z.object({
  conversationId: z.uuid()
}).strict()
export const resParticipantSchema = z.object({
  participantId: z.uuid()
}).strict()

export const resSummarizeSchema = z.object({
  summary: z.string().min(1)
}).strict()

export const resAiMetaSchema = z.object({
  name: z.string().min(1),
  createdAt: z.iso.datetime(),
  aiId: z.uuid()
}).strict()

export const resAiMetaArraySchema = z.array(resAiMetaSchema)

export const resAiSchema = z.object({
  role: z.enum(['user', 'model']),
  message: z.string().min(1),
  messageId: z.uuid(),
  createdAt: z.iso.datetime()
}).strict()

export const resAiArraySchema = z.array(resAiSchema)