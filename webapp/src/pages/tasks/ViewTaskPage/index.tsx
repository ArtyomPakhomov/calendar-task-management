import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns/format'
import { Link, useParams } from 'react-router'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditTaskRoute, ViewTaskRouteParams } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const ViewTaskPage = withPageWrapper({
  useQuery: () => {
    const { id } = useParams() as ViewTaskRouteParams
    const trpcClint = trpc.useTRPC()
    const queryResult = useQuery(trpcClint.getTask.queryOptions({ id }))
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
