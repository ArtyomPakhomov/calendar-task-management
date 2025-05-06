import { appContext, createTaskWithAuthor, createUser, getTrpcCaller } from '../../../test/integration'

describe('setTaskLike', () => {
  it('create like', async () => {
    const { task } = await createTaskWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result = await trpcCallerForLiker.setTaskLike({
      taskId: task.id,
      isLikedByMe: true,
    })
    expect(result).toMatchObject({
      task: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const taskLikes = await appContext.prisma.taskLike.findMany()

    expect(taskLikes).toHaveLength(1)
    expect(taskLikes[0]).toMatchObject({
      taskId: task.id,
      userId: liker.id,
    })
  })

  it('remove like', async () => {
    const { task } = await createTaskWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result1 = await trpcCallerForLiker.setTaskLike({
      taskId: task.id,
      isLikedByMe: true,
    })
    expect(result1).toMatchObject({
      task: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const result2 = await trpcCallerForLiker.setTaskLike({
      taskId: task.id,
      isLikedByMe: false,
    })
    expect(result2).toMatchObject({
      task: {
        isLikedByMe: false,
        likesCount: 0,
      },
    })
    const taskLikes = await appContext.prisma.taskLike.findMany()
    expect(taskLikes).toHaveLength(0)
  })
})
