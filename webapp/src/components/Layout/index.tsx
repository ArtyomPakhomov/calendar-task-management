import { Link, Outlet } from 'react-router'
import { useMe } from '../../lib/ctx'
import * as routes from '../../lib/routes'

export const Layout = () => {
  const me = useMe()

  return (
    <div>
      <h1>Calendar Task Management</h1>
      <nav>
        <ul>
          <li>
            <Link to={routes.getAllTasksRoute()}>All Tasks</Link>
          </li>

          {me ? (
            <>
              <li>
                <Link to={routes.getNewTasksRoute()}>Add Task</Link>
              </li>
              <li>
                <Link to={routes.getEditProfileRoute()}>Edit Profile</Link>
              </li>
              <li>
                <Link to={routes.getSignOutRoute()}>Log Out ({me.name})</Link>
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
