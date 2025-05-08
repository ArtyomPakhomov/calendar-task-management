import cors from 'cors'
import express from 'express'
import { type AppContext, createAppContext } from './lib/ctx'
import { env } from './lib/env'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/passport'
import { initSentry } from './lib/sentry'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'

void (async () => {
  let ctx: AppContext | null = null
  try {
    initSentry()
    ctx = createAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.use(cors())

    applyPassportToExpressApp(expressApp, ctx)
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter)

    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error({ logType: 'express', error })
      if (res.headersSent) {
        next(error)
        return
      }
      res.status(500).send('Internal server error')
    })

    expressApp.listen(env.PORT, () => {
      logger.info({ logType: 'express', message: `Listening at http://localhost:${env.PORT}` })
    })
  } catch (error) {
    logger.error({ logType: 'app', error })
    await ctx?.stop()
  }
})()
