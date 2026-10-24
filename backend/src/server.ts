import expressEntry from './expressEntry.ts'
import { getPort } from './getPort.ts'
import { createServer } from 'node:http'
// import { Server } from 'socket.io'

const server = createServer(expressEntry)
// const io = new Server(server)

const port = getPort()

server.listen(port, (): void => {
  console.log(`Server is listening on port ${port}. Stop it with Ctrl+C`)
})