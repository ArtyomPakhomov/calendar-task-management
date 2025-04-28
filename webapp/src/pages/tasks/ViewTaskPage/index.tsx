import { canBlockTask, canEditTask } from '@calendar-task-management/backend/src/utils/can'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns/format'
import { Link } from 'react-router'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditTaskRoute, getViewTasksRoute } from '../../../lib/routes'
import { queryClient, trpc } from '../../../lib/trpc'
import { LikeButton } from './LikeButton'
import type { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'

const BlockTask = ({ task }: { task: NonNullable<TrpcRouterOutput['getTask']['task']> }) => {
  const useTrpc = trpc.useTRPC()
  const blockTask = useMutation(useTrpc.blockTask.mutationOptions())
  const { alertProps, buttonProps, formik } = useForm({
    onSubmit: async () => {
      await blockTask.mutateAsync({ taskId: task.id })
      await queryClient.refetchQueries(useTrpc.getTask.queryOptions({ taskId: task.id }))
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <Alert {...alertProps} />
      <Button type="submit" children="Block task" color="red" {...buttonProps} />
    </form>
  )
}

export const ViewTaskPage = withPageWrapper({
  showLoaderOnFetching: false,
  useQuery: () => {
    const { id } = getViewTasksRoute.useParams()

    const useTrpc = trpc.useTRPC()
    // const data = queryClient.getQueryData(useTrpc.getTask.queryKey({ taskId: id }))
    // console.info(data)
    const queryResult = useQuery(useTrpc.getTask.queryOptions({ taskId: id }))
    return queryResult
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    me: ctx.me,
    task: checkExists(queryResult.data.task, 'Task not found'),
  }),
  title: ({ task }) => task.title,
})(({ task, me }) => {
  return (
    <div>
      <h1>{task.title}</h1>
      <small>
        Created At: <i>{format(task.createdAt, 'yyyy-MM-dd')}</i>
        <br />
        Author: <i>{task.author.name}</i> Email: <i>{task.author.email}</i>
      </small>
      <p>{task.description}</p>
      <div>
        <span style={{ marginRight: '10px' }}>Likes: {task.likesCount}</span>
        {me && <LikeButton task={task} />}
      </div>
      {canEditTask(me, task) && (
        <div>
          <Link to={getEditTaskRoute({ id: task.id })}>Edit Task</Link>
          <br />

          {/* <button href={`/delete-task/${task.id}`}>Delete</button> */}
        </div>
      )}
      {canBlockTask(me) && <BlockTask task={task} />}
    </div>
  )
})
