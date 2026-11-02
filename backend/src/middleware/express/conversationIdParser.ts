import type { RequestHandler } from 'express'
import { idSchema } from '@chappy/shared'

export const conversationIdParser: RequestHandler = (req, res, next) => {
  const idResult = idSchema.safeParse(req.params.conversationId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.conversationId = idResult.data

  next()
}