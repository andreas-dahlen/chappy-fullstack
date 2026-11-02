import type { RequestHandler } from 'express'
import { idSchema } from '@chappy/shared'

export const participantIdParser: RequestHandler = (req, res, next) => {
  const idResult = idSchema.safeParse(req.params.participantId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.participantId = idResult.data

  next()
}