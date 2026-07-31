import type { ElementType, ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps {
  children: ReactNode
  /** `narrow` for reading-width prose, `wide` for edge-to-edge galleries. */
  width?: 'narrow' | 'default' | 'wide'
  as?: ElementType
  className?: string
}

/** The single source of horizontal gutters and max-width across the site. */
export function Container({
  children,
  width = 'default',
  as: Component = 'div',
  className,
}: ContainerProps) {
  return (
    <Component className={[styles.container, styles[width], className].filter(Boolean).join(' ')}>
      {children}
    </Component>
  )
}
