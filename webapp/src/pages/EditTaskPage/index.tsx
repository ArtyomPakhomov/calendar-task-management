import { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'
import { zUpdateTaskTrpcInput } from '@calendar-task-management/backend/src/router/updateTask/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../components/Alert'
import { Input } from '../../components/Input'
import { Textarea } from '../../components/Textarea'
import { EditTaskRouteParams, getViewTasksRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditTaskComponent = ({ task }: { task: NonNullable<TrpcRouterOutput['getTask']['task']> }) => {
  const navigate = useNavigate()

  const [errorMessageVisible, setErrorMessageVisible] = useState<string | null>(null)

  const trpcClint = trpc.useTRPC()
  const updateTask = useMutation(trpcClint.updateTask.mutationOptions())

  const formik = useFormik({
    // initialValues: pick(task, ['title', 'description']),
    initialValues: {
      title: task.title,
      description: task.description,
    },
    validate: withZodSchema(zUpdateTaskTrpcInput.omit({ taskId: true })),
    onSubmit: async (values) => {
      try {
        await updateTask.mutateAsync({ taskId: task.id, ...values })
        navigate(getViewTasksRoute({ id: task.id }))
      } catch (error: any) {
        setErrorMessageVisible(error.message)
        setTimeout(() => {
          setErrorMessageVisible(null)
        }, 3000)
      }
    },
  })

  return (
    <div>
      <h2>Update Task Page</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input formik={formik} name="title" label="Title" />
        <Textarea formik={formik} name="description" label="Description" />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Please fill out all fields</div>}
        {!!errorMessageVisible && <Alert color="red" children={errorMessageVisible} />}
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Update task'}
        </button>
      </form>
    </div>
  )
}
export const EditTaskPage = () => {
  const { id } = useParams() as EditTaskRouteParams

  const trpcClint = trpc.useTRPC()
  const getTask = useQuery(trpcClint.getTask.queryOptions({ id }))
  const getMe = useQuery(trpcClint.getMe.queryOptions())

  if (
    getTask.isLoading ||
    getTask.isFetching ||
    getTask.isPending ||
    getMe.isLoading ||
    getMe.isFetching ||
    getMe.isPending
  ) {
    return <div>Loading...</div>
  }

  if (getTask.isError) {
    return <div>Error: {getTask.error.message}</div>
  }

  if (getMe.isError) {
    return <div>Error: {getMe.error.message}</div>
  }
  if (!getTask.data.task) {
    return <div>Task not found</div>
  }

  const task = getTask.data.task
  const me = getMe.data.me

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
