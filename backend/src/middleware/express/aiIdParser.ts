import type { RequestHandler } from 'express'
import { uuidSchema } from '@chappy/shared'

export const aiIdParser: RequestHandler = (req, res, next) => {
  const idResult = uuidSchema.safeParse(req.params.conversationId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.aiId = idResult.data

  next()
}