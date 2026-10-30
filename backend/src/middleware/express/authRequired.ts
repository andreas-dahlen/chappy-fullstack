import type { RequestHandler } from 'express'
import { authHandler } from '../../auth/authHandler.ts'

export const authRequired: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    res.sendStatus(401)
    return
  }

  const token = authorization.slice(7)
  const result = authHandler(token)

  if (!result.success) {
    res.sendStatus(result.reason === 'internal-error' ? 500 : 401)
    return
  }

  res.locals.userId = result.userId
  next()
}