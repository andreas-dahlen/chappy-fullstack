import { genSalt, hash } from 'bcrypt'
import type { DbCredentials } from '../types/db.types.ts'
import type { RegCredentials } from '@chappy/shared'

export async function createUser(
  signInData: RegCredentials
): Promise<DbCredentials> {
  const salt = await genSalt(10)
  const hashed = await hash(signInData.password, salt)
  return {
    ownerId: crypto.randomUUID(),
    name: signInData.name,
    username: signInData.username,
    hashPassword: hashed,
  }
}