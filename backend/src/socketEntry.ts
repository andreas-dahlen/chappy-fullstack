import type { Server } from 'socket.io'
import { authHandler } from './auth/authHandler.ts'
import { logger } from './utils/logger.ts'

export function initializeSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    const result = authHandler(token)

    if (!result.success) {
      next(new Error(result.reason))
      return
    }

    socket.data.userId = result.userId
    next()
  })

  io.on('connection', socket => {
    const userId = socket.data.userId

    socket.join(`user:${userId}`)

    logger.info(`User ${userId} connected`)

    socket.on('disconnect', reason => {
      logger.info(`User ${userId} disconnected: ${reason}`)
    })
  })
}