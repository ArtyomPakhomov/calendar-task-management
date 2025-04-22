import { zCreateTaskTrpcInput } from '@calendar-task-management/backend/src/router/tasks/createTask/input'
import { useMutation } from '@tanstack/react-query'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const NewTaskPage = withPageWrapper({
  authorizedOnly: true,
})(() => {
  const useTrpc = trpc.useTRPC()
  const createTask = useMutation(useTrpc.createTask.mutationOptions())

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: zCreateTaskTrpcInput,
    onSubmit: async (values) => {
      await createTask.mutateAsync(values)
    },
    showValidationAlert: true,
    successMessage: 'Task created successfully!',
  })

  return (
    <div>
      <h2>New Task Page</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input formik={formik} name="title" label="Title" />
        <Textarea formik={formik} name="description" label="Description" />
        <Alert {...alertProps} />
        <Button type="submit" children="Create task" {...buttonProps} />
      </form>
    </div>
  )
})
