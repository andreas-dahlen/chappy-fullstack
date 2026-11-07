import type { RequestHandler } from 'express'
import { uuidSchema } from '@chappy/shared'

export const channelIdParser: RequestHandler = (req, res, next) => {
  const idResult = uuidSchema.safeParse(req.params.channelId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.channelId = idResult.data

  next()
}