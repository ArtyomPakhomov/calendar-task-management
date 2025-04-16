import { useQuery } from '@tanstack/react-query'
import { Link, Outlet } from 'react-router'
import * as routes from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const Layout = () => {
  const trpcClint = trpc.useTRPC()
  const { data, isLoading, isFetching, isError, isPending } = useQuery(trpcClint.getMe.queryOptions())

  return (
    <div>
      <h1>Calendar Task Management</h1>
      <nav>
        <ul>
          <li>
            <Link to={routes.getAllTasksRoute()}>All Tasks</Link>
          </li>

          {isLoading || isFetching || isError || isPending ? null : data.me ? ( // TODO: isError - обработать ошибку отдельно и разлогиниться
            <>
              <li>
                <Link to={routes.getNewTasksRoute()}>Add Task</Link>
              </li>
              <li>
                <Link to={routes.getSignOutRoute()}>Log Out ({data.me.name})</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={routes.getSignUpRoute()}>Sign Up</Link>
              </li>
              <li>
                <Link to={routes.getSignInRoute()}>Sign In</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}
