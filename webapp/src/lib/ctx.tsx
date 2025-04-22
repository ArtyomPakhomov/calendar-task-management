/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { Loader } from '../components/Loader'
import { trpc } from './trpc'
import type { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'

export type AppContext = {
  me: TrpcRouterOutput['getMe']['me']
}

const AppReactContext = createContext<AppContext>({ me: null })

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const useTrpc = trpc.useTRPC()
  const { data, error, isError, isLoading, isFetching, isPending } = useQuery(useTrpc.getMe.queryOptions())

  return (
    <AppReactContext.Provider
      value={{
        me: data?.me || null,
      }}
    >
      {isLoading || isFetching || isPending ? (
        <Loader type="page" />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        children
      )}
    </AppReactContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}
