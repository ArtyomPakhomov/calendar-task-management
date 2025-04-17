export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  type?: 'button' | 'submit'
}
export const Button = ({ children, loading = false, type = 'button', ...props }: ButtonProps) => {
  return (
    <button type={type} disabled={loading} {...props}>
      {loading ? 'Submitting...' : children}
    </button>
  )
}
