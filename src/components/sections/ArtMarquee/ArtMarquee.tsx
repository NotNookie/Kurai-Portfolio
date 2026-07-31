import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { home } from '@/data/site'
import { getFeatured } from '@/lib/content'
import { Icon } from '@/components/ui'
import styles from './ArtMarquee.module.css'

/**
 * Continuously scrolling strip of recent artwork, as on the reference site.
 *
 * The track is rendered twice and translated by exactly -50%, which makes the
 * loop seamless without any JS measuring. The duplicate is `aria-hidden` so the
 * gallery is not announced twice.
 *
 * Motion stops entirely under `prefers-reduced-motion` — the strip becomes a
 * normal horizontally scrollable row rather than animating slowly, because a
 * slow infinite crawl is still a vestibular trigger.
 */
export function ArtMarquee() {
  const featured = getFeatured(12)
  const reduceMotion = useReducedMotion()

  if (featured.length === 0) return null

  // Longer strips need proportionally longer durations to hold a steady speed.
  const durationSeconds = Math.max(28, featured.length * 6)

  const renderTrack = (hidden: boolean) =>
    featured.map((artwork) => (
      <li key={`${hidden ? 'dup-' : ''}${artwork.slug}`} className={styles.item}>
        <Link
          to={`/illustrations?piece=${artwork.slug}`}
          className={styles.link}
          // The duplicated half must not be reachable or announced.
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden || undefined}
        >
          <img
            src={artwork.cover.src}
            alt={hidden ? '' : artwork.cover.alt}
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
        <Link to="/illustrations" className={styles.cta}>
          {home.marquee.cta}
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>

      <div className={styles.viewport} data-static={reduceMotion || undefined}>
        <ul
          className={styles.track}
          role="list"
          style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
        >
          {renderTrack(false)}
          {/* Seamless-loop duplicate; hidden from assistive tech. */}
          {reduceMotion ? null : renderTrack(true)}
        </ul>
      </div>
    </section>
  )
}
