import { type User } from '@prisma/client'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express, type Request } from 'express'
import SuperJSON from 'superjson'
import { type TrpcRouter } from '../router'
import { type AppContext } from './ctx'

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
export const trpc = initTRPC.context<TrpcContext>().create({
  transformer: SuperJSON,
})

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )
}
