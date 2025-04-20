import { Alert } from '../Alert'

export const ErrorPageComponent = ({
  title = 'Oops, error',
  message = 'Something went wrong',
}: {
  title?: string
  message?: string
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <Alert color="red">{message}</Alert>
    </div>
  )
}
