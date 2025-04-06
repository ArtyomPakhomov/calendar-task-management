import { initTRPC } from '@trpc/server'
const trpc = initTRPC.create()

const tasks = [
  { id: '1', title: 'Title 1', description: 'Description of title 1...' },
  { id: '2', title: 'Title 2', description: 'Description of title 2...' },
  { id: '3', title: 'Title 3', description: 'Description of title 3...' },
  { id: '4', title: 'Title 4', description: 'Description of title 4...' },
  { id: '5', title: 'Title 5', description: 'Description of title 5...' },
]

export const trpcRouter = trpc.router({
  getTasks: trpc.procedure.query(() => {
    return { tasks }
  }),
})
export type TrpcRouter = typeof trpcRouter
