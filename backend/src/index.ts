import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'

import { trpcRouter } from './trpc'

const expressApp = express()

expressApp.use(cors())
expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
  })
)

expressApp.get('/ping', (req, res) => {
  res.send('pong')
})

expressApp.listen(5000, () => {
  console.info('Listening at http://localhost:5000')
})
