import { initTRPC } from '@trpc/server'
import _ from 'lodash'
import { z } from 'zod'

const tasks = _.times(10, (i) => ({
  id: `${i + 1}`,
  title: `Title ${i + 1}`,
  description: `Description of title ${i + 1}...`,
}))

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getTasks: trpc.procedure.query(() => {
    return { tasks }
  }),
  getTask: trpc.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        task: tasks.find((task) => task.id === input.id) || null,
      }
    }),
})
export type TrpcRouter = typeof trpcRouter
