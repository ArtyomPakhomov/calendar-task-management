import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { ViewTaskPageRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AllTasksPage = () => {
  const trpcClint = trpc.useTRPC()
  const { data, isLoading, isFetching, isPending, isError, error } = useQuery(trpcClint.getTasks.queryOptions())

  if (isLoading || isFetching || isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  console.info(data)

  return (
    <div>
      <h1>All Tasks</h1>
      <ul>
        {data.tasks.map((task) => (
          <li key={task.id}>
            <Link to={ViewTaskPageRoute({ id: task.id })}>{task.title}</Link>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
