import { tasks } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'
import { zCreateTaskTrpcInput } from './input'

export const createTaskTrpcRoute = trpc.procedure.input(zCreateTaskTrpcInput).mutation(({ input }) => {
  const task = {
    id: `${Math.random()}`,
    title: input.title,
    description: input.description,
  }
  tasks.unshift(task)
  return true
})
