import type { FormikProps } from 'formik'

export const Input = ({
  name,
  label,
  formik,
  type = 'text',
}: {
  name: string
  label: string
  formik: FormikProps<any>
  type?: 'text' | 'password'
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined // TODO: fix this
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        disabled={formik.isSubmitting}
        onChange={(e) => void formik.setFieldValue(name, e.target.value)}
        onBlur={() => {
          void formik.setFieldTouched(name, true)
        }}
      />
      {formik.touched[name] && formik.errors[name] && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
