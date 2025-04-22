import { useMutation } from '@tanstack/react-query'
import { queryClient, trpc } from '../../../../lib/trpc'
import type { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'

export const LikeButton = ({ task }: { task: NonNullable<TrpcRouterOutput['getTask']['task']> }) => {
  const useTrpc = trpc.useTRPC()

  const setTaskLike = useMutation(
    useTrpc.setTaskLike.mutationOptions({
      onMutate: ({ isLikedByMe }) => {
        const oldGetTaskData = queryClient.getQueryData(useTrpc.getTask.queryKey({ taskId: task.id }))
        if (oldGetTaskData?.task) {
          const newGetTaskData = {
            ...oldGetTaskData,
            task: {
              ...oldGetTaskData.task,
              likesCount: oldGetTaskData.task.likesCount + (isLikedByMe ? 1 : -1),
              isLikedByMe,
            },
          }
          queryClient.setQueryData(useTrpc.getTask.queryKey({ taskId: task.id }), newGetTaskData)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: useTrpc.getTask.queryKey({ taskId: task.id }) })
      },
    })
  )
  return (
    <button
      onClick={() => {
        setTaskLike.mutate({
          taskId: task.id,
          isLikedByMe: !task.isLikedByMe,
        })
      }}
    >
      {task.isLikedByMe ? 'Unlike' : 'Like'}
    </button>
  )
}
