import * as z from 'zod'

export const uuidSchema = z.uuid()
export const dbUserSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  name: z.string(),
  ownerId: z.uuid(),
  hashPassword: z.string()
}).strict()
export const dbUserArraySchema = z.array(dbUserSchema)

export const dbChannelSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  name: z.string(),
  ownerId: z.uuid(),
  authRequired: z.boolean(),
  timestamp: z.iso.datetime()
}).strict()

export const dbChannelArraySchema = z.array(dbChannelSchema)

export const dbSignInSchema = z.object({
  username: z.string(),
  password: z.string()
}).strict()

export const dbRegisterSchema = dbSignInSchema.extend({
  name: z.string()
}).strict()