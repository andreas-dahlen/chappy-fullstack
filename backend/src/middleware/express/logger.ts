import type { RequestHandler } from 'express'
import { logger } from '../../utils/logger.ts'

export const expressLogger: RequestHandler = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`)

  res.on('finish', () => {
    logger.info(`Status code: ${res.statusCode}`)
  })

  next()
}