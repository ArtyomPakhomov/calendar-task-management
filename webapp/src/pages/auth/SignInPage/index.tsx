import { zSignInTrpcInput } from '@calendar-task-management/backend/src/router/auth/signIn/input'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getAllTasksRoute } from '../../../lib/routes'
import { queryClient, trpc } from '../../../lib/trpc'

export const SignInPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign In',
})(() => {
  const navigate = useNavigate()
  const useTrpc = trpc.useTRPC()
  const signIn = useMutation(useTrpc.signIn.mutationOptions())

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token } = await signIn.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      queryClient.invalidateQueries()
      navigate(getAllTasksRoute())
    },
    resetOnSuccess: false,
  })
  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={formik.handleSubmit}>
        <Input formik={formik} name="email" label="Email" />
        <Input formik={formik} name="password" label="Password" />
        <Alert {...alertProps} />
        <Button children="Sign In" type="submit" {...buttonProps} />
      </form>
    </div>
  )
})
