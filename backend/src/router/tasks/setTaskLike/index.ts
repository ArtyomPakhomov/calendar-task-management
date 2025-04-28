import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zSetTaskLikeTrpcInput } from './input'

export const setTaskLikeTrpcRoute = trpcLoggedProcedure
  .input(zSetTaskLikeTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { taskId, isLikedByMe } = input

    if (!ctx.me) throw new Error('UNAUTHORIZED')
    const task = await ctx.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })
    if (!task) throw new Error('TASK_NOT_FOUND')

    if (isLikedByMe) {
      await ctx.prisma.taskLike.upsert({
        where: {
          taskId_userId: {
            taskId,
            userId: ctx.me.id,
          },
        },
        create: {
          taskId,
          userId: ctx.me.id,
        },
        update: {},
      })
    } else {
      await ctx.prisma.taskLike.delete({
        where: {
          taskId_userId: {
            taskId,
            userId: ctx.me.id,
          },
        },
      })
    }
    const taskLikesCount = await ctx.prisma.taskLike.count({
      where: {
        taskId,
      },
    })
    return {
      task: {
        id: task.id,
        likesCount: taskLikesCount,
        isLikedByMe,
      },
    }
  })
