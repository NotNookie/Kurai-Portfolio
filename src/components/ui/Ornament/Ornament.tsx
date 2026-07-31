import styles from './Ornament.module.css'

/**
 * Decorative page furniture, in the spirit of the reference site's あしらい
 * (ornaments): soft pastel blobs and polka-dot fields lifted from Kurai's own
 * cover art.
 *
 * All of it is `aria-hidden` and `pointer-events: none`. It must never carry
 * text or become the only cue for anything — the raw cover pink and cyan sit
 * around 3:1 and 1.5:1 on this ground, which is why they are ornament-only.
 */

type BlobTone = 'pink' | 'cyan' | 'mixed'
type BlobPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'

interface BlobProps {
  tone?: BlobTone
  placement?: BlobPlacement
  /** Multiplier on the base size, e.g. 1.4 for a larger blob. */
  scale?: number
  className?: string
}

export function Blob({
  tone = 'pink',
  placement = 'top-right',
  scale = 1,
  className,
}: BlobProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.blob, styles[tone], styles[placement], className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--blob-scale': scale } as React.CSSProperties}
    />
  )
}

interface DotFieldProps {
  /** Dot spacing in px. Larger reads calmer. */
  gap?: number
  className?: string
}

/** The polka-dot texture from the cover art, as a tileable background. */
export function DotField({ gap = 18, className }: DotFieldProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.dots, className].filter(Boolean).join(' ')}
      style={{ '--dot-gap': `${gap}px` } as React.CSSProperties}
    />
  )
}
