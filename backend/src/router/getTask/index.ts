import { z } from 'zod'
import { tasks } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'

export const getTaskTrpcRoute = trpc.procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(({ input }) => {
    return {
      task: tasks.find((task) => task.id === input.id) || null,
    }
  })
