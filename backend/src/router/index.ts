import { trpc } from '../lib/trpc'
import { getTaskTrpcRoute } from './getTask'
import { getTasksTrpcRoute } from './getTasks'

export const trpcRouter = trpc.router({
  getTasks: getTasksTrpcRoute,
  getTask: getTaskTrpcRoute,
})
export type TrpcRouter = typeof trpcRouter
