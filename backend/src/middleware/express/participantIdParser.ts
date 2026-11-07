import type { RequestHandler } from 'express'
import { uuidSchema } from '@chappy/shared'

export const participantIdParser: RequestHandler = (req, res, next) => {
  const idResult = uuidSchema.safeParse(req.params.participantId)

  if (!idResult.success) {
    res.sendStatus(400)
    return
  }

  res.locals.participantId = idResult.data

  next()
}