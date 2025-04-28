import { type User } from '@prisma/client'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express, type Request } from 'express'
import SuperJSON from 'superjson'
import { type TrpcRouter } from '../router'
import { type AppContext } from './ctx'
import { logger } from './logger'

export type ExpressRequest = Request & {
  user: User | undefined
}

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => {
    return {
      ...appContext,
      me: (req as ExpressRequest).user || null,
    }
  }

type TrpcContext = ReturnType<typeof getCreateTrpcContext> // TODOO: fix this!
const trpc = initTRPC.context<TrpcContext>().create({
  transformer: SuperJSON,
})

export const createTrpcRouter = trpc.router

export const trpcLoggedProcedure = trpc.procedure.use(
  trpc.middleware(async ({ path, type, next, ctx, getRawInput }) => {
    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      durationMs,
      rawInput: (await getRawInput()) || null,
    }
    if (result.ok) {
      logger.info({
        logType: `trpc:${type}:success`,
        message: 'Successfull request',
        meta: { ...meta, output: result.data },
      })
    } else {
      logger.error({ logType: `trpc:${type}:error`, error: result.error, meta })
    }
    return result
  })
)

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )
}
