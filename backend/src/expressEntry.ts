import express, { type Express } from 'express'
import path from 'node:path'
import cors from 'cors'

const entry: Express = express()
const distPath: string = path.resolve(import.meta.dirname, '../../frontend/dist')

entry.use(cors())
entry.use(express.static(distPath))

// Tala om för Chrome att den här webbservern inte stöder tekniken Workspaces i DevTools
entry.get('/.well-known/appspecific/com.chrome.devtools.json', (_, res) => {
  res.status(404).end()
})

const apiRouter = express.Router()
entry.use('/api', apiRouter)


// apiRouter.use('/api/???', productRouter)


// Wildcard route: behövs för att React Router med BrowserRouter i frontend ska fungera!
entry.use((_, res) => {
  // console.log('WILDCARD ROUTE!')
  res.sendFile('index.html', { root: distPath })
  // Windows använder backslash för sökvägar, alla andra forward slash
  // Win: C:\a\b\c
  // Mac/Linux: /usr/a/b/c
})





export default entry