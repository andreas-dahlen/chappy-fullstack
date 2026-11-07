import type { RequestHandler } from 'express'
import { uuidSchema } from '@chappy/shared'

export const conversationIdParser: RequestHandler = (req, res, next) => {
  const idResult = uuidSchema.safeParse(req.params.conversationId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.conversationId = idResult.data

  next()
}