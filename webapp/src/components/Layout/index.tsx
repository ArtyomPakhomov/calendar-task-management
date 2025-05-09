import { createRef } from 'react'
import { Link, Outlet } from 'react-router'
import Logo from '../../assets/images/logo.svg?react'
import { useMe } from '../../lib/ctx'
import * as routes from '../../lib/routes'
import css from './index.module.scss'

// eslint-disable-next-line react-refresh/only-export-components
export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()

  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <Logo className={css.logo} />
        <ul className={css.menu}>
          {me ? (
            <>
              <li className={css.item}>
                <Link to={routes.getAllTasksRoute()}>All Tasks</Link>
              </li>
              <li className={css.item}>
                <Link to={routes.getNewTasksRoute()}>Add Task</Link>
              </li>
              <li className={css.item}>
                <Link to={routes.getEditProfileRoute()}>Edit Profile</Link>
              </li>
              <li className={css.item}>
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
      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
