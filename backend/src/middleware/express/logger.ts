import type { RequestHandler } from 'express'



export const logger: RequestHandler = (req, res, next): void => {
  console.log(`${req.method} ${req.url}`)

  res.on('finish', () => {
    console.log("status code: ", res.statusCode)
  })

  next()
}