import { commissions } from '@/data/site'
import { getCommissionStatus } from '@/lib/status'
import styles from './CommissionStatus.module.css'

interface CommissionStatusProps {
  className?: string
}

/**
 * The commission status line: a coloured dot and the status word.
 *
 * Shared by About and Contact so the staleness rule is written once. Once the
 * declaration ages out (see `lib/status.ts`) this renders a pointer to VGen
 * instead of a status the site can no longer stand behind — the dot goes with
 * it, since a coloured dot is the loudest part of the claim.
 *
 * Renders the value only; each page supplies its own heading, because they
 * differ semantically — a plain label on About, a section heading on Contact.
 */
export function CommissionStatus({ className }: CommissionStatusProps) {
  const { value } = getCommissionStatus()

  if (!value) {
    return (
      <p className={[styles.stale, className].filter(Boolean).join(' ')}>
        {commissions.staleLabel}
      </p>
    )
  }

  return (
    <p className={[styles.value, className].filter(Boolean).join(' ')}>
      <span className={styles.dot} data-status={value} aria-hidden="true" />
      {value}
    </p>
  )
}
