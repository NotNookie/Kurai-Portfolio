import { Fragment, type ElementType } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SPRING, VIEWPORT } from '@/lib/motion'
import styles from './RevealText.module.css'

interface RevealTextProps {
  children: string
  /** Rendered element — headings should pass their real level. */
  as?: ElementType
  /** Seconds between each word. */
  stagger?: number
  /** Wait before the first word, to let a container settle first. */
  delay?: number
  /**
   * `mount` starts immediately (hero, above the fold); `scroll` waits until the
   * text enters the viewport.
   */
  trigger?: 'mount' | 'scroll'
  id?: string
  className?: string
}

/**
 * Reveals a heading one word at a time.
 *
 * Words are separate inline-blocks so each can carry its own transform, with
 * real spaces left between them so the text wraps and is selected exactly as
 * normal prose. Screen readers see one continuous string — no `aria-label`
 * patching needed, because nothing is hidden or reordered.
 *
 * Under reduced motion it renders the plain string with no spans at all, which
 * also keeps `text-wrap: balance` behaving as it does on untouched text.
 */
export function RevealText({
  children,
  as: Tag = 'span',
  stagger = 0.05,
  delay = 0,
  trigger = 'scroll',
  id,
  className,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }

  const words = children.split(' ').filter(Boolean)
  const motionProps =
    trigger === 'mount'
      ? { initial: 'hidden' as const, animate: 'visible' as const }
      : { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: VIEWPORT }

  return (
    <Tag id={id} className={className}>
      <motion.span
        className={styles.line}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
        {...motionProps}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <motion.span
              className={styles.word}
              variants={{
                hidden: { opacity: 0, y: '0.4em' },
                visible: { opacity: 1, y: 0, transition: SPRING },
              }}
            >
              {word}
            </motion.span>
            {/* A real space, outside the animated span, so lines break here. */}
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}
