import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns/format'
import { useParams } from 'react-router'
import { ViewTaskRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const ViewTaskPage = () => {
  const { id } = useParams() as ViewTaskRouteParams

  const trpcClint = trpc.useTRPC()
  const { data, isLoading, isFetching, isPending, isError, error } = useQuery(trpcClint.getTask.queryOptions({ id }))

  if (isLoading || isFetching || isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  if (!data.task) return <div>Task not found</div>

  return (
    <div>
      <h1>{data.task.title}</h1>
      <small>
        Created At: <i>{format(data.task.createdAt, 'yyyy-MM-dd')}</i>
      </small>
      <p>{data.task.description}</p>
    </div>
  )
}
