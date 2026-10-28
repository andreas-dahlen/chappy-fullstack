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

export const userSchema = z.object({
  name: z.string(),
  userId: z.uuid()
})

export const userArraySchema = z.array(userSchema)