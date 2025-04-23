import { zGetTasksTrpcInput } from '@calendar-task-management/backend/src/router/tasks/getTasks/input'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router'
import { useDebounceValue } from 'usehooks-ts'
import { Input } from '../../../components/Input'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { useForm } from '../../../lib/form'
import { getViewTasksRoute } from '../../../lib/routes'
import { trpc, trpcClient } from '../../../lib/trpc'
import css from './index.module.scss'
export const AllTasksPage = () => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetTasksTrpcInput.pick({ search: true }),
  })
  const search = useDebounceValue(formik.values.search, 500)
  const useTrpc = trpc.useTRPC()

  const { data, error, isLoading, isError, hasNextPage, isPending, fetchNextPage, isFetchingNextPage, isRefetching } =
    useInfiniteQuery({
      queryKey: [useTrpc.getTasks.pathKey(), { search }],
      queryFn: async ({ pageParam }) => {
        return trpcClient.getTasks.query({
          search: formik.values.search,
          cursor: pageParam,
          limit: 5,
        })
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  return (
    <div>
      <h1 className={css.title}>All Tasks</h1>
      <div>
        <Input formik={formik} name="search" label="Search" width={'100%'} />
      </div>
      {isLoading || isRefetching || isPending ? (
        <Loader type="section" />
      ) : isError ? (
        <div>{error.message}</div>
      ) : !data.pages[0].tasks.length ? (
        <div>Nothing found by search</div>
      ) : (
        <ul className={css.tasks}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            hasMore={hasNextPage}
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
                  <div>Likes: {task.likesCount}</div>
                </li>
              ))}
          </InfiniteScroll>
        </ul>
      )}
    </div>
  )
}
