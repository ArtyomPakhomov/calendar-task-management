import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns/format'
import { Link, useParams } from 'react-router'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditTaskRoute, type ViewTaskRouteParams } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import { LikeButton } from './LikeButton'

export const ViewTaskPage = withPageWrapper({
  showLoaderOnFetching: false,
  useQuery: () => {
    const { id } = useParams() as ViewTaskRouteParams
    const useTrpc = trpc.useTRPC()
    // const data = queryClient.getQueryData(useTrpc.getTask.queryKey({ taskId: id }))
    // console.info(data)
    const queryResult = useQuery(useTrpc.getTask.queryOptions({ taskId: id }))
    return queryResult
  },
  setProps: ({ queryResult, checkExists, getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
    task: checkExists(queryResult.data.task, 'Task not found'),
  }),
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
        Likes: {task.likesCount}
        {me && (
          <>
            <br />
            <LikeButton task={task} />
          </>
        )}
      </div>
      {me.id === task.authorId && (
        <div>
          <Link to={getEditTaskRoute({ id: task.id })}>Edit Task</Link>
          <br />
          {/* <button href={`/delete-task/${task.id}`}>Delete</button> */}
        </div>
      )}
    </div>
  )
})
