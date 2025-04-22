import { zUpdateTaskTrpcInput } from '@calendar-task-management/backend/src/router/tasks/updateTask/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { type EditTaskRouteParams, getViewTasksRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const EditTaskPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { id } = useParams() as EditTaskRouteParams
    const useTrpc = trpc.useTRPC()
    const queryResult = useQuery(useTrpc.getTask.queryOptions({ taskId: id }))
    return queryResult
  },

  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const task = checkExists(queryResult.data.task, 'Task not found')
    checkAccess(ctx.me && ctx.me.id === task.authorId, 'An task can only be edited by the author')
    return { task }
  },
})(({ task }) => {
  const navigate = useNavigate()
  const useTrpc = trpc.useTRPC()
  const updateTask = useMutation(useTrpc.updateTask.mutationOptions())

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
})
