import { trpc } from '../../../lib/trpc'
import { zGetTasksTrpcInput } from './input'

export const getTasksTrpcRoute = trpc.procedure.input(zGetTasksTrpcInput).query(async ({ ctx, input }) => {
  const tasks = await ctx.prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      serialNumber: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextTask = tasks.at(input.limit)
  const nextCursor = nextTask?.serialNumber
  const tasksExceptNext = tasks.slice(0, input.limit)
  return { tasks: tasksExceptNext, nextCursor }
})
