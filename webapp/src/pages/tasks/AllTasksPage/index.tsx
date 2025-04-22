import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router'
import { getViewTasksRoute } from '../../../lib/routes'
import { trpc, trpcClient } from '../../../lib/trpc'
export const AllTasksPage = () => {
  const useTrpc = trpc.useTRPC()
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    useInfiniteQuery({
      queryKey: useTrpc.getTasks.queryKey(),
      queryFn: async ({ pageParam }) => {
        return await trpcClient.getTasks.query({
          cursor: pageParam,
          limit: 2,
        })
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  if (isLoading || isRefetching) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h1>All Tasks</h1>
      <ul>
        <InfiniteScroll
          threshold={250}
          loadMore={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          hasMore={hasNextPage}
          loader={<div key="loader">Loading ...</div>}
          useWindow={true}
        >
          {data.pages
            .flatMap((page) => page.tasks)
            .map((task) => (
              <li key={task.id}>
                <Link to={getViewTasksRoute({ id: task.id })}>{task.title}</Link>
                <p>{task.description}</p>
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
