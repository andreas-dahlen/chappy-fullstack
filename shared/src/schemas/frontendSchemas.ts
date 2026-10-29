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
})

export const channelArraySchema = z.array(channelSchema)