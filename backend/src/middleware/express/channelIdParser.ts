import type { RequestHandler } from 'express'
import { idSchema } from '@chappy/shared'

export const channelIdParser: RequestHandler = (req, res, next) => {
  const idResult = idSchema.safeParse(req.params.channelId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.channelId = idResult.data

  next()
}