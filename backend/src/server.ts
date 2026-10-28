import expressEntry from './expressEntry.ts'
import { postSeedData } from './fakeDb/postSeedData.ts'
import { getPort } from './getPort.ts'
import { createServer } from 'node:http'
// import { Server } from 'socket.io'

const seedDataArg = process.argv[2]

if (seedDataArg === 'seed') {
  await postSeedData()
} else {
  const server = createServer(expressEntry)
  // const io = new Server(server)

  const port = getPort()

  server.listen(port, (): void => {
    console.log(`Server is listening on port ${port}. Stop it with Ctrl+C`)
  })
}

// entry.post<
//   Params,
//   ResBody,
//   ReqBody,
//   ReqQuery,
//   Locals
// >(
//   '/whatever',
//   middlewareA,
//   middlewareB,
//   middlewareC,
//   (req, res) => {
//     // handler
//   }
// );