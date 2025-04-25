import cn from 'classnames'
import css from './index.module.scss'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  type?: 'button' | 'submit'
  color?: 'red' | 'green'
}
export const Button = ({ children, loading = false, type = 'button', color = 'green', ...props }: ButtonProps) => {
  return (
    <button
      className={cn({ [css.button]: true, [css.loading]: loading, [css[`color-${color}`]]: true })}
      type={type}
      disabled={loading}
      {...props}
    >
      {/* {loading ? 'Submitting...' : children} */}
      <span className={css.text}>{children}</span>
    </button>
  )
}
