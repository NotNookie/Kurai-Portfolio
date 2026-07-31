import styles from './RouteFallback.module.css'

/**
 * Shown while a code-split page chunk downloads.
 *
 * Deliberately minimal and centred at a fixed height — a busy skeleton that
 * flashes for 80ms on a fast connection is worse than a quiet one.
 */
export function RouteFallback() {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading page…</span>
    </div>
  )
}
