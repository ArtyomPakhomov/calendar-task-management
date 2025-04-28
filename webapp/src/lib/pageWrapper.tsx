import { useStore } from '@nanostores/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { Loader } from '../components/Loader'
import { lastVisistedNotAuthRouteStore } from '../components/NotAuthRouteTracker'
import { NotFoundPage } from '../pages/other/NotFoundPage'
import { type AppContext, useAppContext } from './ctx'
import type { QueryObserverBaseResult, QueryObserverSuccessResult } from '@tanstack/react-query'

class GetAuthorizedMeError extends Error {}

class CheckExistsError extends Error {}
const checkExistsFn = <T,>(value: T, message?: string): NonNullable<T> => {
  if (!value) {
    throw new CheckExistsError(message)
  }
  return value
}

class CheckAccessError extends Error {}
const checkAccessFn = <T,>(value: T, message?: string): void => {
  if (!value) {
    throw new CheckAccessError(message)
  }
}

type Props = Record<string, any>
type QueryResult = QueryObserverBaseResult<any, any>

type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: AppContext
  queryResult: TQueryResult extends QueryResult
    ? QueryObserverSuccessResult<NonNullable<TQueryResult['data']>, null>
    : undefined
}

type SetPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
  checkAccess: typeof checkAccessFn
  getAuthorizedMe: (message?: string) => NonNullable<AppContext['me']>
}

type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean

  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string

  checkAccess?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkAccessTitle?: string
  checkAccessMessage?: string

  checkExists?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string

  showLoaderOnFetching?: boolean

  title: string | ((titleProps: HelperProps<TQueryResult> & TProps) => string)
  isTitleExact?: boolean

  useQuery?: () => TQueryResult
  setProps?: (setPropsProps: SetPropsProps<TQueryResult>) => TProps
  Page: React.FC<TProps>
}
// eslint-disable-next-line react-refresh/only-export-components
const PageWrapper = <TProps extends Props, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Please, Authorize',
  authorizedOnlyMessage = 'This page is available only for authorized users',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Access Denied',
  checkAccessMessage = 'You have no access to this page',
  checkExists,
  checkExistsTitle = 'Not Found',
  checkExistsMessage = 'This page does not exist',
  showLoaderOnFetching = true,
  title,
  isTitleExact = false,
  useQuery,
  setProps,
  Page,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const lastVisistedNotAuthRoute = useStore(lastVisistedNotAuthRouteStore)
  const navigate = useNavigate()
  const ctx = useAppContext()
  const queryResult = useQuery?.()

  const redirectNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectNeeded) {
      navigate(lastVisistedNotAuthRoute, { replace: true })
    }
  }, [redirectNeeded, navigate, lastVisistedNotAuthRoute])

  if (
    queryResult?.isPending ||
    queryResult?.isLoading ||
    (showLoaderOnFetching && queryResult?.isFetching) ||
    redirectNeeded
  ) {
    return <Loader type="page" />
  }
  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }
  if (queryResult?.isError) {
    return <ErrorPageComponent message={queryResult.error.message} />
  }

  const helperProps = { ctx, queryResult: queryResult as never }

  if (checkAccess) {
    const accessDenied = !checkAccess(helperProps)
    if (accessDenied) {
      return <NotFoundPage title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const notExists = !checkExists(helperProps)
    if (notExists) {
      return <NotFoundPage title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const getAuthorizedMe = (message?: string) => {
    if (!ctx.me) {
      throw new GetAuthorizedMeError(message)
    }
    return ctx.me
  }

  try {
    const props = setProps?.({
      ...helperProps,
      checkExists: checkExistsFn,
      checkAccess: checkAccessFn,
      getAuthorizedMe,
    }) as TProps

    // const calculatedTitil = typeof title === 'function' ? title({ ...helperProps, ...props }) : title
    const calculatedTitil = typeof title === 'function' ? title({ ...helperProps, ...props }) : title
    const exactTitle = isTitleExact ? calculatedTitil : `CTM - ${calculatedTitil}`
    return (
      <>
        <title>{exactTitle}</title>
        <Page {...props} />
      </>
    )
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }
    if (error instanceof CheckAccessError) {
      return <ErrorPageComponent title={checkAccessTitle} message={error.message || checkAccessMessage} />
    }
    if (error instanceof GetAuthorizedMeError) {
      return <ErrorPageComponent title={authorizedOnlyTitle} message={error.message || authorizedOnlyMessage} />
    }
    throw error
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const withPageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  pageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    return () => <PageWrapper {...pageWrapperProps} Page={Page} />
  }
}
