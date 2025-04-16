import { trpc } from '../../lib/trpc'
import { getPasswordHash } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'
import { zSignInTrpcInput } from './input'

export const signInTrpcRoute = trpc.procedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })

  if (!user) {
    throw new Error('Worng email or password')
  }

  const token = signJWT(user.id)
  return { token }
})
