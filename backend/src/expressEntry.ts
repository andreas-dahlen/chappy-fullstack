import express, { type Express } from 'express'
import path from 'node:path'
import userRouter from './routers/userRouter.ts'
import channelRouter from './routers/channelRouter.ts'
import { logger } from './middleware/express/logger.ts'
import registerRouter from './routers/registerRouter.ts'

const entry: Express = express()
const distPath: string = path.resolve(import.meta.dirname, '../../frontend/dist')

entry.use(express.static(distPath))

// Tala om för Chrome att den här webbservern inte stöder tekniken Workspaces i DevTools
entry.get('/.well-known/appspecific/com.chrome.devtools.json', (_, res) => {
  res.status(404).end()
})

const apiRouter = express.Router()
entry.use('/api', apiRouter)

apiRouter.use(logger)
apiRouter.use('/users', userRouter)
apiRouter.use('/channels', channelRouter)
apiRouter.use('/register', registerRouter)


// Wildcard route: behövs för att React Router med BrowserRouter i frontend ska fungera!
entry.use((_, res) => {
  // console.log('WILDCARD ROUTE!')
  res.sendFile('index.html', { root: distPath })
  // Windows använder backslash för sökvägar, alla andra forward slash
  // Win: C:\a\b\c
  // Mac/Linux: /usr/a/b/c
})

export default entry