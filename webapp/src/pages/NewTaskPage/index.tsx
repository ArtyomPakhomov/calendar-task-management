import { useFormik } from 'formik'

export const NewTaskPage = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {}
      if (!values.title) {
        errors.title = 'Title is required'
      } else if (!/^[a-zA-Z0-9-]+$/.exec(values.title)) {
        errors.title = 'Title may contain only letters, numbers and dashes'
      }
      if (!values.description) {
        errors.description = 'Description is required'
      } else if (values.description.length < 10) {
        errors.description = 'Description must be at least 10 characters long'
      }
      return errors
    },
    onSubmit: (values) => {
      console.info('Submitted', values)
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
