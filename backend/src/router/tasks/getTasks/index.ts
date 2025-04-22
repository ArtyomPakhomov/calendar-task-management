import { trpc } from '../../../lib/trpc'
import { zGetTasksTrpcInput } from './input'

export const getTasksTrpcRoute = trpc.procedure.input(zGetTasksTrpcInput).query(async ({ ctx, input }) => {
  const rawTasks = await ctx.prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      serialNumber: true,
      _count: {
        select: {
          tasksLikes: true,
        },
      },
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

  const nextTask = rawTasks.at(input.limit)
  const nextCursor = nextTask?.serialNumber
  const rawTasksExceptNext = rawTasks.slice(0, input.limit)

  const tasks = rawTasksExceptNext.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    likesCount: task._count.tasksLikes,
  }))

  return { tasks, nextCursor }
})
