import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { getJwtSecret } from '../envGetters/getJwtSecret.ts'

const { verify } = jwt

export type AuthResult =
  | { success: true; userId: string }
  | { success: false; reason: 'missing-token' | 'invalid-token' | 'expired-token' | 'invalid-payload' }
  | { success: false; reason: 'internal-error' }

export function authHandler(token: string | undefined): AuthResult {
  if (!token) {
    return { success: false, reason: 'missing-token' }
  }

  try {
    const decoded = verify(token, getJwtSecret())

    if (typeof decoded === 'string' || typeof decoded.uuid !== 'string') {
      return { success: false, reason: 'invalid-payload' }
    }

    return { success: true, userId: decoded.uuid }
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return { success: false, reason: 'expired-token' }
    }

    if (error instanceof JsonWebTokenError) {
      return { success: false, reason: 'invalid-token' }
    }

    return { success: false, reason: 'internal-error' }
  }
}