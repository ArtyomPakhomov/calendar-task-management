import { zCreateTaskTrpcInput } from '@calendar-task-management/backend/src/router/createTask/input'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert'
import { Input } from '../../components/Input'
import { Textarea } from '../../components/Textarea'
import { trpc } from '../../lib/trpc'

export const NewTaskPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [errorMessageVisible, setErrorMessageVisible] = useState<string | null>(null)
  const trpcClint = trpc.useTRPC()
  const createTask = useMutation(trpcClint.createTask.mutationOptions())

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validate: withZodSchema(zCreateTaskTrpcInput),
    onSubmit: async (values) => {
      try {
        await createTask.mutateAsync(values)
        formik.resetForm()
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
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
      <h2>New Task Page</h2>
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
        {successMessageVisible && <Alert color="green" children={'Task created successfully!'} />}
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Create task'}
        </button>
      </form>
    </div>
  )
}
