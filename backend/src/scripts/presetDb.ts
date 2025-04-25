import { env } from '../lib/env'
import { getPasswordHash } from '../utils/getPasswordHash'
import type { AppContext } from '../lib/ctx'

export const presetDb = async (ctx: AppContext) => {
  await ctx.prisma.user.upsert({
    where: {
      email: 'admin@admin.com',
    },
    create: {
      email: env.INITIAL_ADMIN_EMAIL,
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
    },
    update: {
      permissions: ['ALL'],
    },
  })
}
