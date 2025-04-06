import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import { TrpcRouter } from '../router'

export const trpc = initTRPC.create()

export const applayTrpcToExpressApp = (expressApp: Express, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
    })
  )
}
