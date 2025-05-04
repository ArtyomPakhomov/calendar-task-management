/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type TRPCLink, createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { observable } from '@trpc/server/observable'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import Cookies from 'js-cookie'
import SuperJSON from 'superjson'
import { env } from './env'
import { sentryCaptureException } from './sentry'
import type { TrpcRouter } from '@calendar-task-management/backend/src/router'

export const trpc = createTRPCContext<TrpcRouter>()
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value)
        },
        error(error) {
          if (env.NODE_ENV !== 'development') {
            console.error(error)
          }
          if (!error.data?.isExpected) {
            sentryCaptureException(error)
          }

          observer.error(error)
        },
        complete() {
          observer.complete()
        },
      })
      return unsubscribe
    })
  }
}

export const trpcClient = createTRPCClient<TrpcRouter>({
  links: [
    customTrpcLink,
    loggerLink({
      enabled: () => env.NODE_ENV === 'development',
    }),
    httpBatchLink({
      url: env.VITE_BACKEND_TRPC_URL,
      headers: () => {
        const token = Cookies.get('token')
        return {
          ...(token && { authorization: `Bearer ${token}` }),
        }
      },
      transformer: SuperJSON,
    }),
  ],
})

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.TRPCProvider>
    </QueryClientProvider>
  )
}
