import { zUpdatePasswordTrpcInput } from '@calendar-task-management/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileTrpcInput } from '@calendar-task-management/backend/src/router/auth/updateProfile/input'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { queryClient, trpc } from '../../../lib/trpc'
import type { TrpcRouterOutput } from '@calendar-task-management/backend/src/router'

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  const useTrpc = trpc.useTRPC()
  console.info(useTrpc.getMe.queryKey())

  //   const data = queryClient.getQueryData(useTrpc.getMe.queryKey())
  //   console.info(data)

  const updateProfile = useMutation(useTrpc.updateProfile.mutationOptions())
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: me.name,
      email: me.email,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      queryClient.setQueryData(useTrpc.getMe.queryKey(), { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })
  return (
    <div>
      <h2>General</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input label="Email" name="email" formik={formik} />
        <Input label="Name" name="name" formik={formik} />
        <Alert {...alertProps} />
        <Button type="submit" children="Update Profile" {...buttonProps} />
      </form>
    </div>
  )
}

const Password = () => {
  const useTrpc = trpc.useTRPC()
  const updatePassword = useMutation(useTrpc.updatePassword.mutationOptions())
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordConfirmation: z.string().min(3),
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.newPasswordConfirmation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must be the same',
            path: ['newPasswordConfirmation'],
          })
        }
      }),
    onSubmit: async ({ oldPassword, newPassword }) => {
      await updatePassword.mutateAsync({ oldPassword, newPassword })
    },
    successMessage: 'Password updated',
  })
  return (
    <div>
      <h2>Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input label="Old Password" name="oldPassword" type="password" formik={formik} />
        <Input label="New Password" name="newPassword" type="password" formik={formik} />
        <Input label="New Password Confirmation" name="newPasswordConfirmation" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button type="submit" children="Update Password" {...buttonProps} />
      </form>
    </div>
  )
}

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  return (
    <div>
      <h1>Edit Profile</h1>
      <General me={me} />
      <Password />
    </div>
  )
})
