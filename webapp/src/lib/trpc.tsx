import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'

import type { TrpcRouter } from '@calendar-task-management/backend/src/trpc'

export const trpc = createTRPCContext<TrpcRouter>()
// react-refresh/only-export-components
const queryClient = new QueryClient({
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
      url: 'http://localhost:5000/trpc',
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
