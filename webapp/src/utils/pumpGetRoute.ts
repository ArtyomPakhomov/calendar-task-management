import { useParams as useReactRouterParams } from 'react-router'

// eslint-disable-next-line node/no-process-env
const baseUrl = process.env.VITE_WEBAPP_URL || process.env.WEBAPP_URL

type PumpedGetRouteParamsBase = {
  abs?: boolean
}

function pumpGetRoute<T extends Record<string, boolean>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: Record<keyof T, string>) => string
): {
  (params: Record<keyof T, string> & PumpedGetRouteParamsBase): string
  routeParams: Record<keyof T, string>
  useParams: () => Record<keyof T, string>
  route: string
}

function pumpGetRoute(getRoute: () => string): {
  (params?: PumpedGetRouteParamsBase): string
  route: string
}

function pumpGetRoute(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute
  const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute
  const routeParams = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})

  const route = getRoute(routeParams)

  const pumpedGetRoute = (params?: PumpedGetRouteParamsBase) => {
    const route = getRoute(params)
    if (params?.abs) {
      return `${baseUrl}${route}`
    } else {
      return route
    }
  }
  pumpedGetRoute.routeParams = routeParams
  pumpedGetRoute.route = route
  pumpedGetRoute.useParams = useReactRouterParams as any
  return pumpedGetRoute
}

export type RouteParams<T extends { routeParams: Record<string, string> }> = T['routeParams']

export const pgr = pumpGetRoute
