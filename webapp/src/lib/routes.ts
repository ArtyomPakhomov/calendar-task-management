import { pgr } from '../utils/pumpGetRoute'

export const getViewTasksRoute = pgr({ id: true }, ({ id }) => `/tasks/${id}`)

export const getEditTaskRoute = pgr({ id: true }, ({ id }) => `/tasks/${id}/edit`)

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getAllTasksRoute = pgr(() => '/')

export const getCalendarRoute = pgr(() => '/calendar')

export const getNewTasksRoute = pgr(() => '/tasks/new')
