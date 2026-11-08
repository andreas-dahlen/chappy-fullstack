import type * as z from 'zod'
import { uuidSchema } from '../schemas/dbSchemas.ts'
import type { resAiMetaSchema, resAiSchema, resAuthSchema, resChannelMsgSchema, resChannelSchema, resConversationMsgSchema, resConversationSchema, resFromAiSchema, resParticipantSchema, resUserSchema } from '../schemas/responseSchemas.ts'
import type { reqAiMetaSchema, reqChannelCreationSchema, reqMessageSchema, reqRegisterSchema, reqSignInSchema, reqSummarizeSchema } from '../schemas/requestSchemas.ts'

export type UUID = z.infer<typeof uuidSchema>
export type User = z.infer<typeof resUserSchema>

export type Channel = z.infer<typeof resChannelSchema>

export type Auth = z.infer<typeof resAuthSchema>

export type MessageData =
  | z.infer<typeof resChannelMsgSchema>
  | z.infer<typeof resConversationMsgSchema>

export type Participant = z.infer<typeof resParticipantSchema>

export type Conversation = z.infer<typeof resConversationSchema>


export type RegistrationCredentials = z.infer<typeof reqRegisterSchema>

export type SignInCredentials = z.infer<typeof reqSignInSchema>

export type MessageInput = z.infer<typeof reqMessageSchema>
export type ChannelCreationInput = z.infer<typeof reqChannelCreationSchema>

export type SummarizeInput = z.infer<typeof reqSummarizeSchema>

export type AiMetaInput = z.infer<typeof reqAiMetaSchema>

export type AiResponse = z.infer<typeof resFromAiSchema>

export type AiMetaData = z.infer<typeof resAiMetaSchema>
export type AiMessage = z.infer<typeof resAiSchema>