import cn from 'classnames'
import css from './index.module.css'
export const Alert = ({
  children,
  color = 'brown',
}: {
  children: React.ReactNode
  color?: 'red' | 'green' | 'brown'
}) => {
  return <div className={cn({ [css.alert]: true, [css[color]]: true })}>{children}</div>
}
