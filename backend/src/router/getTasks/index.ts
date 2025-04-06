import { tasks } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'

export const getTasksTrpcRoute = trpc.procedure.query(() => {
  return { tasks }
})
