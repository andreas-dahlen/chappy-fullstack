import * as z from 'zod'

export const reqSignInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
}).strict()

export const reqRegisterSchema = reqSignInSchema.extend({
  name: z.string().min(1)
}).strict()

export const reqMessageSchema = z.object({
  message: z.string()
}).strict()

export const reqChannelCreationSchema = z.object({
  name: z.string().min(1),
  authRequired: z.boolean()
}).strict()

export const reqSummarizeSchema = z.object({
  text: z.string().min(1)
}).strict()

export const reqAiMetaSchema = z.object({
  name: z.string().min(1)
})