import { Alert } from '../Alert'

export const ErrorPageComponent = ({
  children,
  title = 'Oops, error',
  message = 'Something went wrong',
}: {
  children?: React.ReactNode
  title?: string
  message?: string
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <Alert color="red">{message}</Alert>
      {children}
    </div>
  )
}
