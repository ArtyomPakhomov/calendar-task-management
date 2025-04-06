import { tasks } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'
import { zGetTaskTrpcInput } from './input'

export const getTaskTrpcRoute = trpc.procedure.input(zGetTaskTrpcInput).query(({ input }) => {
  return {
    task: tasks.find((task) => task.id === input.id) || null,
  }
})
