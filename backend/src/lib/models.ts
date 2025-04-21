import _ from 'lodash'
import type { User } from '@prisma/client'

export const toClientMe = (user: User | null) => {
  return user && _.pick(user, ['id', 'name', 'email'])
}
