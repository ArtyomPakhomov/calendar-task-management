import { atom } from 'nanostores'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getAllTasksRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'

export const lastVisistedNotAuthRouteStore = atom(getAllTasksRoute())

export const NotAuthRouteTracker = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    const authRoutes = [getSignInRoute(), getSignUpRoute(), getSignOutRoute()]
    const isAuthRoute = authRoutes.includes(pathname)
    if (!isAuthRoute) {
      lastVisistedNotAuthRouteStore.set(pathname)
    }
  }, [pathname])

  return null
}
