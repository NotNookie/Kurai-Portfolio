import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { home } from '@/data/site'
import { getFeatured } from '@/lib/content'
import { Icon } from '@/components/ui'
import type { Artwork } from '@/types/content'
import styles from './ArtMarquee.module.css'

interface ArtMarqueeProps {
  /** Number of scrolling rows. Directions alternate. */
  rows?: number
}

/**
 * Continuously scrolling rows of artwork, as on the reference site.
 *
 * Each row's track is rendered twice and translated by exactly -50% (or +50%
 * going the other way), which makes the loop seamless without measuring
 * anything in JS. The duplicate is `aria-hidden` so the gallery is not
 * announced twice.
 *
 * The rows deliberately do NOT pause on hover — they keep moving while the
 * pointer is over them. They do pause on `:focus-within`, which is a different
 * concern: a keyboard user tabbing into a moving strip would otherwise have the
 * focused tile slide out from under them.
 *
 * Under `prefers-reduced-motion` the animation stops entirely and the duplicate
 * track is dropped, leaving plain horizontally scrollable rows — a slow
 * infinite crawl is still a vestibular trigger.
 */
export function ArtMarquee({ rows = 3 }: ArtMarqueeProps) {
  const featured = getFeatured(24)
  const reduceMotion = useReducedMotion()

  if (featured.length === 0) return null

  /**
   * Offset each row so they do not read as the same sequence stacked up.
   * With a small collection this is what stops the rows looking cloned.
   */
  const rowItems = (rowIndex: number): readonly Artwork[] => {
    const offset = (rowIndex * Math.ceil(featured.length / rows)) % featured.length
    return [...featured.slice(offset), ...featured.slice(0, offset)]
  }

  const renderTiles = (items: readonly Artwork[], duplicate: boolean) =>
    items.map((artwork) => (
      <li key={`${duplicate ? 'dup-' : ''}${artwork.slug}`} className={styles.item}>
        <Link
          to={`/works?piece=${artwork.slug}`}
          className={styles.link}
          // The duplicated half must not be reachable or announced.
          tabIndex={duplicate ? -1 : undefined}
          aria-hidden={duplicate || undefined}
        >
          <img
            src={artwork.cover.src}
            alt={duplicate ? '' : artwork.cover.alt}
            loading="lazy"
            decoding="async"
            className={styles.image}
          />
        </Link>
      </li>
    ))

  return (
    <section className={styles.section} aria-labelledby="marquee-heading">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>{home.marquee.eyebrow}</p>
          <h2 id="marquee-heading" className={styles.heading}>
            {home.marquee.heading}
          </h2>
        </div>
        <Link to="/works" className={styles.cta}>
          {home.marquee.cta}
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>

      <div className={styles.rows}>
        {Array.from({ length: rows }, (_, rowIndex) => {
          const items = rowItems(rowIndex)
          // Longer strips need proportionally longer durations to hold a
          // steady speed; the slight per-row variance keeps them from
          // locking into visual sync.
          const duration = Math.max(30, items.length * 7) + rowIndex * 5

          return (
            <div
              key={rowIndex}
              className={styles.viewport}
              data-static={reduceMotion || undefined}
              data-direction={rowIndex % 2 === 0 ? 'left' : 'right'}
            >
              <ul
                className={styles.track}
                role="list"
                style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
              >
                {renderTiles(items, false)}
                {reduceMotion ? null : renderTiles(items, true)}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
