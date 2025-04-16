/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import Cookies from 'js-cookie'
import SuperJSON from 'superjson'
import { env } from './env'
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

const trpcClient = createTRPCClient<TrpcRouter>({
  links: [
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
