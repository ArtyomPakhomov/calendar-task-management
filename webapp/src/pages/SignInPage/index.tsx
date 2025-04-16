import { zSignInTrpcInput } from '@calendar-task-management/backend/src/router/signIn/input'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert } from '../../components/Alert'
import { Input } from '../../components/Input'
import { getAllTasksRoute } from '../../lib/routes'
import { queryClient, trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const navigate = useNavigate()
  const [errorMessageVisible, setErrorMessageVisible] = useState<string | null>(null)
  const trpcClint = trpc.useTRPC()
  const signIn = useMutation(trpcClint.signIn.mutationOptions())
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (values) => {
      try {
        const { token } = await signIn.mutateAsync(values)
        Cookies.set('token', token, { expires: 99999 })
        queryClient.invalidateQueries()
        navigate(getAllTasksRoute())
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
      <h1>Sign In</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input formik={formik} name="email" label="Email" />
        <Input formik={formik} name="password" label="Password" />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Please fill out all fields</div>}
        {!!errorMessageVisible && <Alert color="red" children={errorMessageVisible} />}
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
