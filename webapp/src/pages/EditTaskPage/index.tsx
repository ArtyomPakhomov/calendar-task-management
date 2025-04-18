import { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'
import { zUpdateTaskTrpcInput } from '@calendar-task-management/backend/src/router/updateTask/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Textarea } from '../../components/Textarea'
import { useMe } from '../../lib/ctx'
import { useForm } from '../../lib/form'
import { EditTaskRouteParams, getViewTasksRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditTaskComponent = ({ task }: { task: NonNullable<TrpcRouterOutput['getTask']['task']> }) => {
  const navigate = useNavigate()
  const trpcClint = trpc.useTRPC()
  const updateTask = useMutation(trpcClint.updateTask.mutationOptions())

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      title: task.title,
      description: task.description,
    },
    validationSchema: zUpdateTaskTrpcInput.omit({ taskId: true }),
    onSubmit: async (values) => {
      await updateTask.mutateAsync({ taskId: task.id, ...values })
      navigate(getViewTasksRoute({ id: task.id }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <div>
      <h2>Update Task Page</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input formik={formik} name="title" label="Title" />
        <Textarea formik={formik} name="description" label="Description" />
        <Alert {...alertProps} />
        <Button type="submit" children="Update task" {...buttonProps} />
      </form>
    </div>
  )
}
export const EditTaskPage = () => {
  const { id } = useParams() as EditTaskRouteParams

  const trpcClint = trpc.useTRPC()
  const getTask = useQuery(trpcClint.getTask.queryOptions({ id }))
  const me = useMe()

  if (getTask.isLoading || getTask.isFetching || getTask.isPending) {
    return <div>Loading...</div>
  }

  if (getTask.isError) {
    return <div>Error: {getTask.error.message}</div>
  }
  if (!getTask.data.task) {
    return <div>Task not found</div>
  }

  const task = getTask.data.task

  if (!task) {
    return <div>Task not found</div>
  }
  if (!me) {
    return <div>Only for authorized</div>
  }

  if (me.id !== task.authorId) {
    return <div>An task can only be edited by the author</div>
  }

  return <EditTaskComponent task={task} />
}
