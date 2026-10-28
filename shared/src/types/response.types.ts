import type z from 'zod'
import { dbUserSchema, uuidSchema } from '../schemas/dbSchemas.ts'

export type UUID = z.infer<typeof uuidSchema>
export type User = {
  name: string
  userId: UUID
}

export type DbUser = z.infer<typeof dbUserSchema>