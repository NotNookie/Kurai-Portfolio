import { Link } from 'react-router-dom'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon/Icon'
import styles from './Button.module.css'

type Variant = 'solid' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  /** Appends a trailing arrow, or an external-link glyph for `href` buttons. */
  withArrow?: boolean
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & {
    to?: never
    href?: never
  }

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & {
    /** Internal route — renders a react-router <Link>. */
    to: string
    href?: never
  }

type ButtonAsAnchor = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & {
    /** External URL — renders a plain <a> with safe rel attributes. */
    href: string
    to?: never
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

/**
 * One control for the three things that look like buttons: real buttons,
 * internal routes, and external links. Keeping them unified is what stops
 * `<div onClick>` from creeping in — every variant is natively focusable.
 */
export function Button({
  variant = 'solid',
  size = 'md',
  withArrow = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {withArrow ? (
        <Icon
          name={'href' in rest && rest.href ? 'external' : 'arrow-right'}
          size={size === 'sm' ? 14 : 16}
          className={styles.arrow}
        />
      ) : null}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkProps } = rest as ButtonAsLink
    return (
      <Link to={to} className={classes} {...linkProps}>
        {content}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsAnchor
    return (
      // noreferrer alongside noopener: older browsers ignore the latter.
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
