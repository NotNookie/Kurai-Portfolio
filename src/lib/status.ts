import { site, type CommissionStatus } from '@/data/site'

/**
 * Commission status, with a shelf life.
 *
 * The status is a factual claim about whether Kurai is taking work, and nothing
 * in a static site keeps it true. The failure is asymmetric: a stale "Closed"
 * costs nothing, while a stale "Open" means someone writes in, waits, and is
 * let down.
 *
 * So the declaration carries the date it was last confirmed, and past
 * `MAX_AGE_DAYS` the site stops asserting it and points at VGen — which is the
 * real source of truth — instead. It can go quiet; it cannot sit there lying.
 */

/** How long a confirmed status stays trustworthy. */
export const MAX_AGE_DAYS = 30

export interface CommissionStatusView {
  /** The status to display, or `null` once the declaration has gone stale. */
  value: CommissionStatus | null
  /** Whole days since it was last confirmed; `null` if the date is unusable. */
  ageDays: number | null
}

export function getCommissionStatus(now: Date = new Date()): CommissionStatusView {
  const { value, asOf } = site.commissionStatus

  const confirmed = new Date(`${asOf}T00:00:00Z`)
  // A missing or malformed date reads as stale, never as a live claim — the
  // safe direction to fail in.
  if (Number.isNaN(confirmed.getTime())) return { value: null, ageDays: null }

  const ageDays = Math.floor((now.getTime() - confirmed.getTime()) / 86_400_000)

  // A future date is as untrustworthy as an ancient one.
  if (ageDays < 0 || ageDays > MAX_AGE_DAYS) return { value: null, ageDays }

  return { value, ageDays }
}
