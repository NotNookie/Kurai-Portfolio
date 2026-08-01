import { useEffect, useRef, useState } from 'react'
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

interface MarqueeRowProps {
  items: readonly Artwork[]
  direction: 'left' | 'right'
  durationSeconds: number
  reduceMotion: boolean
}

/**
 * One scrolling row.
 *
 * The track is rendered as N identical sequences and animated by exactly -50%,
 * so the loop is seamless with no JS driving the animation.
 *
 * The catch, and the reason this measures: -50% only reads as seamless if **one
 * half of the track is at least as wide as the viewport**. With a small
 * collection the half is only a few thousand pixels, so on an ultra-wide
 * display — or simply zoomed out — the end of the track scrolled into view and
 * left a visible gap. The row therefore measures one sequence and repeats it
 * enough times to always overflow, re-measuring on resize and zoom.
 */
function MarqueeRow({ items, direction, durationSeconds, reduceMotion }: MarqueeRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  /** Total sequences in the track; always even, half of them the animated copy. */
  const [copies, setCopies] = useState(2)

  useEffect(() => {
    if (reduceMotion) return
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const measure = () => {
      const tiles = track.children
      const first = tiles[0] as HTMLElement | undefined
      // The first tile of the second sequence: the distance between them is
      // exactly one sequence including its trailing gap.
      const secondSequenceStart = tiles[items.length] as HTMLElement | undefined
      if (!first || !secondSequenceStart) return

      const sequenceWidth = secondSequenceStart.offsetLeft - first.offsetLeft
      if (sequenceWidth <= 0) return

      const perHalf = Math.max(1, Math.ceil(viewport.clientWidth / sequenceWidth))
      const next = perHalf * 2
      setCopies((prev) => (prev === next ? prev : next))
    }

    // Deliberately not calling measure() here: ResizeObserver fires an initial
    // callback on observe, so state updates stay inside the subscription rather
    // than running synchronously in the effect body.
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [copies, items.length, reduceMotion])

  // Reduced motion: a single static sequence in a plain scrollable row.
  const sequences = reduceMotion ? 1 : copies

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      data-static={reduceMotion || undefined}
      data-direction={direction}
    >
      <ul
        ref={trackRef}
        className={styles.track}
        role="list"
        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        {Array.from({ length: sequences }, (_, copyIndex) =>
          items.map((artwork) => {
            // Only the first sequence is real; the rest are visual filler.
            const isDuplicate = copyIndex > 0
            return (
              <li key={`${copyIndex}-${artwork.slug}`} className={styles.item}>
                <Link
                  to={`/works?piece=${artwork.slug}`}
                  className={styles.link}
                  tabIndex={isDuplicate ? -1 : undefined}
                  aria-hidden={isDuplicate || undefined}
                >
                  {/**
                   * Eager, not lazy — this is load-bearing.
                   *
                   * The row moves by CSS transform rather than by scrolling, and
                   * the lazy-loading heuristic keys off scroll position. Tiles
                   * that start off-screen never trip it and never load, so they
                   * drift into view as empty boxes and stay that way: measured
                   * at 13 of 36 images ever loading, with the count flat no
                   * matter how long the rows ran.
                   *
                   * `fetchPriority="low"` keeps these behind the hero's LCP
                   * image, and every duplicate sequence reuses the first
                   * sequence's URLs, so the extra copies cost no requests.
                   */}
                  <img
                    src={artwork.cover.src}
                    alt={isDuplicate ? '' : artwork.cover.alt}
                    loading="eager"
                    fetchPriority="low"
                    decoding="async"
                    className={styles.image}
                  />
                </Link>
              </li>
            )
          }),
        )}
      </ul>
    </div>
  )
}

/**
 * Continuously scrolling rows of artwork, as on the reference site.
 *
 * The rows deliberately do NOT pause on hover — they keep moving while the
 * pointer is over them. They do pause on `:focus-within`, which is a different
 * concern: a keyboard user tabbing into a moving strip would otherwise have the
 * focused tile slide out from under them.
 *
 * Under `prefers-reduced-motion` the animation stops entirely and only a single
 * sequence renders, leaving plain horizontally scrollable rows — a slow
 * infinite crawl is still a vestibular trigger.
 */
export function ArtMarquee({ rows = 3 }: ArtMarqueeProps) {
  const featured = getFeatured(24)
  const reduceMotion = useReducedMotion() ?? false

  if (featured.length === 0) return null

  /**
   * Offset each row so they do not read as the same sequence stacked up.
   * With a small collection this is what stops the rows looking cloned.
   */
  const rowItems = (rowIndex: number): readonly Artwork[] => {
    const offset = (rowIndex * Math.ceil(featured.length / rows)) % featured.length
    return [...featured.slice(offset), ...featured.slice(0, offset)]
  }

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
          // Longer strips need proportionally longer durations to hold a steady
          // speed; the per-row variance keeps them from locking into sync.
          // Scaled with the tile width — a wider track at the same duration
          // would read as a faster scroll.
          const durationSeconds = Math.max(60, items.length * 14) + rowIndex * 10

          return (
            <MarqueeRow
              key={rowIndex}
              items={items}
              direction={rowIndex % 2 === 0 ? 'left' : 'right'}
              durationSeconds={durationSeconds}
              reduceMotion={reduceMotion}
            />
          )
        })}
      </div>
    </section>
  )
}
