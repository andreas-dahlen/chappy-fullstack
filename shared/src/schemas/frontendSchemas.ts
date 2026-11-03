import * as z from 'zod'

export const userSchema = z.object({
  name: z.string(),
  userId: z.uuid()
}).strict()

export const userArraySchema = z.array(userSchema)

export const channelSchema = z.object({
  channelId: z.uuid(),
  channelName: z.string(),
  createdBy: z.uuid(),
  authRequired: z.boolean(),
  createdAt: z.iso.datetime()
}).strict()

export const channelArraySchema = z.array(channelSchema)

export const authResponseSchema = z.object({
  token: z.string().min(1),
  userId: z.uuid(),
  name: z.string()
}).strict()

const msgSchema = z.object({
  message: z.string(),
  messageId: z.uuid(),
  createdAt: z.iso.datetime()
}).strict()

export const channelMsgSchema = msgSchema.extend({
  createdBy: z.uuid().or(z.literal('guest'))
})
export const conversationMsgSchema = msgSchema.extend({
  createdBy: z.uuid()
})
export const channelMsgArraySchema = z.array(channelMsgSchema)
export const conversationMsgArraySchema = z.array(conversationMsgSchema)


export const conversationSchema = z.object({
  conversationId: z.uuid()
}).strict()
export const participantSchema = z.object({
  participantId: z.uuid()
}).strict()