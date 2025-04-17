import { zSignUpTrpcInput } from '@calendar-task-management/backend/src/router/signUp/input'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useForm } from '../../lib/form'
import { getAllTasksRoute } from '../../lib/routes'
import { queryClient, trpc } from '../../lib/trpc'
export const SignUpPage = () => {
  const navigate = useNavigate()
  const trpcClint = trpc.useTRPC()
  const signUp = useMutation(trpcClint.signUp.mutationOptions())

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: z.string().min(3),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.passwordAgain) {
          ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['passwordAgain'],
          })
        }
      }),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      queryClient.invalidateQueries()
      navigate(getAllTasksRoute())
    },
    resetOnSuccess: false,
  })

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input formik={formik} name="name" label="Name" />
        <Input formik={formik} name="email" label="Email" />
        <Input formik={formik} name="password" label="Password" type="password" />
        <Input formik={formik} name="passwordAgain" label="Password again" type="password" />
        <Alert {...alertProps} />
        <Button type="submit" children="Sign Up" {...buttonProps} />
      </form>
    </div>
  )
}
