import { trpc } from '../../../lib/trpc'
import { zGetTaskTrpcInput } from './input'

export const getTaskTrpcRoute = trpc.procedure.input(zGetTaskTrpcInput).query(async ({ ctx, input }) => {
  const task = await ctx.prisma.task.findUnique({
    where: {
      id: input.id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return { task }
})
