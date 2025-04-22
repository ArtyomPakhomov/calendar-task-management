import _ from 'lodash'
import { trpc } from '../../../lib/trpc'
import { zGetTaskTrpcInput } from './input'

export const getTaskTrpcRoute = trpc.procedure.input(zGetTaskTrpcInput).query(async ({ ctx, input }) => {
  const rawTask = await ctx.prisma.task.findUnique({
    where: {
      id: input.taskId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tasksLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          tasksLikes: true,
        },
      },
    },
  })
  const isLikedByMe = !!rawTask?.tasksLikes.length // true or false
  const likesCount = rawTask?._count.tasksLikes || 0

  const task = rawTask && { ..._.omit(rawTask, ['tasksLikes', '_count']), isLikedByMe, likesCount }

  return { task }
})
