import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns/format'
import { Link, useParams } from 'react-router'
import { getEditTaskRoute, ViewTaskRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const ViewTaskPage = () => {
  const { id } = useParams() as ViewTaskRouteParams

  const trpcClint = trpc.useTRPC()
  const getTask = useQuery(trpcClint.getTask.queryOptions({ id }))
  const getMe = useQuery(trpcClint.getMe.queryOptions())

  if (
    getTask.isLoading ||
    getTask.isFetching ||
    getTask.isPending ||
    getMe.isLoading ||
    getMe.isFetching ||
    getMe.isPending
  )
    return <div>Loading...</div>
  if (getTask.isError) return <div>Error: {getTask.error.message}</div>
  if (getMe.isError) return <div>Error: {getMe.error.message}</div>

  const task = getTask.data.task
  const me = getMe.data.me

  if (!task) return <div>Task not found</div>

  return (
    <div>
      <h1>{task.title}</h1>
      <small>
        Created At: <i>{format(task.createdAt, 'yyyy-MM-dd')}</i>
        <br />
        Author: <i>{task.author.name}</i>
      </small>
      <p>{task.description}</p>
      {me && me.id === task.authorId && (
        <div>
          <Link to={getEditTaskRoute({ id: task.id })}>Edit Task</Link>
          <br />
          {/* <button href={`/delete-task/${task.id}`}>Delete</button> */}
        </div>
      )}
    </div>
  )
}
