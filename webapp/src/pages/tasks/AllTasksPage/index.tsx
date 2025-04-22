import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { getViewTasksRoute } from '../../../lib/routes'
import { trpc, trpcClient } from '../../../lib/trpc'
import css from './index.module.scss'
export const AllTasksPage = () => {
  const useTrpc = trpc.useTRPC()
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    useInfiniteQuery({
      queryKey: useTrpc.getTasks.queryKey(),
      queryFn: async ({ pageParam }) => {
        return await trpcClient.getTasks.query({
          cursor: pageParam,
          limit: 5,
        })
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  if (isLoading || isRefetching) return <Loader type="section" />
  if (isError) return <div>Error: {error?.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h1 className={css.title}>All Tasks</h1>
      <ul className={css.tasks}>
        <InfiniteScroll
          threshold={250}
          loadMore={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          hasMore={hasNextPage}
          // loader={<div key="loader">Loading ...</div>}
          loader={<Loader type="section" key={'loader'} />}
          getScrollParent={() => layoutContentElRef.current}
          useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
        >
          {data.pages
            .flatMap((page) => page.tasks)
            .map((task) => (
              <li key={task.id} className={css.task}>
                <Link className={css.taskName} to={getViewTasksRoute({ id: task.id })}>
                  {task.title}
                </Link>
                <p className={css.taskDescription}>{task.description}</p>
              </li>
            ))}
        </InfiniteScroll>
      </ul>
      {/* <div>
        {hasNextPage && !isFetchingNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
        {isFetchingNextPage && <span>Loading...</span>}
      </div> */}
    </div>
  )
}
