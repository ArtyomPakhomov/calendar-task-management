import type { Task, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybeTask = Pick<Task, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockTask = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_TASKS')
}

export const canEditTask = (user: MaybeUser, task: MaybeTask) => {
  return !!user && !!task && user?.id === task?.authorId
}
