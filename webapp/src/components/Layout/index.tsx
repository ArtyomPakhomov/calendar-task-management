import { Link, Outlet } from 'react-router'
import { getAllTasksRoute, getNewTasksRoute, getSignUpRoute } from '../../lib/routes'

export const Layout = () => {
  return (
    <div>
      <h1>Calendar Task Management</h1>
      <nav>
        <ul>
          <li>
            <Link to={getAllTasksRoute()}>All Tasks</Link>
          </li>
          <li>
            <Link to={getNewTasksRoute()}>Add Task</Link>
          </li>
          <li>
            <Link to={getSignUpRoute()}>Sign Up</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}
