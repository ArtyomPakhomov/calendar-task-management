const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
} // => { id: true } -> { id: ':id' }

export const getAllTasksRoute = () => '/'

export const viewTaskRouteParams = getRouteParams({ id: true }) // => { id: ':id' }
export type ViewTaskRouteParams = typeof viewTaskRouteParams // => { id: string }
export const getViewTasksRoute = ({ id }: ViewTaskRouteParams) => `/tasks/${id}`
// => getViewTasksRoute(viewTaskRouteParams) -> '/tasks/:id'
// => getViewTasksRoute({ id: task.id }) -> '/tasks/id'

export const getNewTasksRoute = () => '/tasks/new'

export const getSignUpRoute = () => '/sign-up'
