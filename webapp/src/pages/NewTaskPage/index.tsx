import { zCreateTaskTrpcInput } from '@calendar-task-management/backend/src/router/createTask/input'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { trpc } from '../../lib/trpc'

export const NewTaskPage = () => {
  const trpcClint = trpc.useTRPC()
  const createTask = useMutation(trpcClint.createTask.mutationOptions())

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validate: withZodSchema(zCreateTaskTrpcInput),
    onSubmit: async (values) => {
      await createTask.mutateAsync(values)
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
        <div>
          <label htmlFor="title">Title</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={(e) => void formik.setFieldValue('title', e.target.value)}
            onBlur={() => {
              void formik.setFieldTouched('title', true)
            }}
          />
          {formik.touched.title && formik.errors.title && <div style={{ color: 'red' }}>{formik.errors.title}</div>}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={(e) => void formik.setFieldValue('description', e.target.value)}
            onBlur={() => {
              void formik.setFieldTouched('description', true)
            }}
          />
          {formik.touched.description && formik.errors.description && (
            <div style={{ color: 'red' }}>{formik.errors.description}</div>
          )}
        </div>
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Please fill out all fields</div>}
        <button type="submit">Create task</button>
      </form>
    </div>
  )
}
