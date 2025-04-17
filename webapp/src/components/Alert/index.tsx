import cn from 'classnames'
import css from './index.module.css'

export type AlertProps = { color?: 'red' | 'green' | 'brown'; children: React.ReactNode; hidden?: boolean }

export const Alert = ({ children, color = 'brown', hidden = false }: AlertProps) => {
  if (hidden) {
    return null
  }
  return <div className={cn({ [css.alert]: true, [css[color]]: true })}>{children}</div>
}
