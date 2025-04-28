import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canEditTask } from '../../../utils/can'
import { zUpdateTaskTrpcInput } from './input'

export const updateTaskTrpcRoute = trpcLoggedProcedure.input(zUpdateTaskTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const task = await ctx.prisma.task.findFirst({
    where: {
      id: input.taskId,
    },
  })
  if (!task) {
    throw new Error('TASK_NOT_FOUND')
  }
  if (!canEditTask(ctx.me, task)) {
    throw new Error('NOT_YUOR_TASK')
  }
  if (task.title !== input.title) {
    const existingTask = await ctx.prisma.task.findFirst({
      where: {
        title: input.title,
      },
    })
    if (existingTask) {
      throw new Error('Task with this title already exists')
    }
  }
  await ctx.prisma.task.update({
    where: {
      id: input.taskId,
    },
    data: {
      title: input.title,
      description: input.description,
    },
  })

  return true
})
