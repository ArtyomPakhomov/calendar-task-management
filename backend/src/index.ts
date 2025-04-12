import cors from 'cors'
import express from 'express'
import { type AppContext, createAppContext } from './lib/ctx'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    const expressApp = express()

    expressApp.use(cors())

    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)

    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })

    expressApp.listen(5000, () => {
      console.info('Listening at http://localhost:5000')
    })
  } catch (e) {
    console.error(e)
    await ctx?.stop()
  }
})()
