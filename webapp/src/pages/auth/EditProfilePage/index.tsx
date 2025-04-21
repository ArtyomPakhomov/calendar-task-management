import { zUpdateProfileTrpcInput } from '@calendar-task-management/backend/src/router/auth/updateProfile/input'
import { useMutation } from '@tanstack/react-query'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { queryClient, trpc } from '../../../lib/trpc'

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  const trpcClient = trpc.useTRPC()
  console.info(trpcClient.getMe.queryKey())

  //   const data = queryClient.getQueryData(trpcClient.getMe.queryKey())
  //   console.info(data)

  const updateProfile = useMutation(trpcClient.updateProfile.mutationOptions())
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: me.name,
      email: me.email,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      queryClient.setQueryData(trpcClient.getMe.queryKey(), { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })
  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input label="Email" name="email" formik={formik} />
        <Input label="Name" name="name" formik={formik} />
        <Alert {...alertProps} />
        <Button type="submit" children="Update Profile" {...buttonProps} />
      </form>
    </div>
  )
})
