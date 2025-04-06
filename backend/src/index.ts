import cors from 'cors'
import express from 'express'
import { applayTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'

const expressApp = express()

expressApp.use(cors())

applayTrpcToExpressApp(expressApp, trpcRouter)

expressApp.get('/ping', (req, res) => {
  res.send('pong')
})

expressApp.listen(5000, () => {
  console.info('Listening at http://localhost:5000')
})
