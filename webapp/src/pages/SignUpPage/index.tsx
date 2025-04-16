import { zSignUpTrpcInput } from '@calendar-task-management/backend/src/router/signUp/input'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/Alert'
import { Input } from '../../components/Input'
import { getAllTasksRoute } from '../../lib/routes'
import { queryClient, trpc } from '../../lib/trpc'
export const SignUpPage = () => {
  const navigate = useNavigate()
  const [errorMessageVisible, setErrorMessageVisible] = useState<string | null>(null)
  const trpcClint = trpc.useTRPC()
  const signUp = useMutation(trpcClint.signUp.mutationOptions())

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
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
        })
    ),
    onSubmit: async (values) => {
      try {
        const { token } = await signUp.mutateAsync(values)
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
      <h2>Sign Up</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input formik={formik} name="name" label="Name" />
        <Input formik={formik} name="email" label="Email" />
        <Input formik={formik} name="password" label="Password" type="password" />
        <Input formik={formik} name="passwordAgain" label="Password again" type="password" />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Please fill out all fields</div>}
        {!!errorMessageVisible && <Alert color="red" children={errorMessageVisible} />}
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
