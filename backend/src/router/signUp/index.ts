import { trpc } from '../../lib/trpc'
import { getPasswordHash } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })
  if (exUser) {
    throw new Error('User already exists')
  }
  const user = await ctx.prisma.user.create({
    data: {
      ...input,
      password: getPasswordHash(input.password),
    },
  })
  const token = signJWT(user.id)
  return { token }
})
