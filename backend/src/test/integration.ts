// eslint-disable-next-line import/order
import '../lib/sentry.mock'
import _ from 'lodash'
import { createAppContext } from '../lib/ctx'
import { env } from '../lib/env'
import { getTrpcContext, type ExpressRequest } from '../lib/trpc'
import { trpcRouter } from '../router'
import { deepMap } from '../utils/deepMap'
import { getPasswordHash } from '../utils/getPasswordHash'
import type { Task, User } from '@prisma/client'

if (env.NODE_ENV !== 'test') {
  throw new Error('Run integration tests only with NODE_ENV=test')
}

export const appContext = createAppContext()

afterAll(appContext.stop)
beforeEach(async () => {
  await appContext.prisma.taskLike.deleteMany()
  await appContext.prisma.task.deleteMany()
  await appContext.prisma.user.deleteMany()
})

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }))
}

export const withoutNoize = (input: any): any => {
  return deepMap(input, ({ value }) => {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.entries(value).reduce((acc, [objectKey, objectValue]: [string, any]) => {
        if ([/^id$/, /Id$/, /At$/].some((regex) => regex.test(objectKey))) {
          return acc
        }
        return {
          ...acc,
          [objectKey]: objectValue,
        }
      }, {})
    }
    return value
  })
}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      name: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ..._.omit(user, ['password']),
    },
  })
}

export const createTask = async ({
  task = {},
  author,
  number = 1,
}: {
  task?: Partial<Task>
  author: Pick<User, 'id'>
  number?: number
}) => {
  return await appContext.prisma.task.create({
    data: {
      authorId: author.id,
      title: `Task ${number}`,
      description: `Task ${number} description`,
      ...task,
    },
  })
}

export const createTaskWithAuthor = async ({
  author,
  task,
  number,
}: {
  author?: Partial<User>
  task?: Partial<Task>
  number?: number
} = {}) => {
  const createdUser = await createUser({ user: author, number })
  const createdTask = await createTask({ task, author: createdUser, number })
  return {
    author: createdUser,
    task: createdTask,
  }
}

export const createTaskLike = async ({
  task,
  liker,
  createdAt,
}: {
  task: Pick<Task, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: Date
}) => {
  return await appContext.prisma.taskLike.create({
    data: {
      taskId: task.id,
      userId: liker.id,
      createdAt,
    },
  })
}
