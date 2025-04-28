import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canBlockTask } from '../../../utils/can'
import { zBlockTaskTrpcInput } from './input'

export const blockTaskTrpcRoute = trpcLoggedProcedure.input(zBlockTaskTrpcInput).mutation(async ({ input, ctx }) => {
  const { taskId } = input

  if (!canBlockTask(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const task = await ctx.prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      author: true,
    },
  })

  if (!task) {
    throw new Error('TASK_NOT_FOUND')
  }
  await ctx.prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  // void sendTaskBlockedEmail({ user: task.author, task })
  return true
})
