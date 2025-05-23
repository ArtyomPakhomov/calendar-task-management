import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateTaskTrpcInput } from './input'

export const createTaskTrpcRoute = trpcLoggedProcedure.input(zCreateTaskTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const exTask = await ctx.prisma.task.findFirst({
    where: {
      title: input.title,
    },
  })
  if (exTask) {
    throw new ExpectedError('Task already exists')
  }
  const task = await ctx.prisma.task.create({
    data: { ...input, authorId: ctx.me.id },
  })
  return { task }
})
