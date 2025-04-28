import { toClientMe } from '../../../lib/models'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zUpdateProfileTrpcInput } from './input'

export const updateProfileTrpcRoute = trpcLoggedProcedure
  .input(zUpdateProfileTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }
    if (ctx.me.email !== input.email) {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })
      if (exUser) {
        throw new Error('User with this email already exists')
      }
    }

    const updateMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        ...input,
      },
    })
    ctx.me = updateMe
    return toClientMe(updateMe)
  })
