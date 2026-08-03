import { motion, useReducedMotion } from 'framer-motion'
import type { Artwork } from '@/types/content'
import { pages } from '@/data/site'
import { tileReveal, VIEWPORT } from '@/lib/motion'
import { ArtImage } from '@/components/art/ArtImage/ArtImage'
import { Icon } from '@/components/ui'
import styles from './ArtworkTile.module.css'

interface ArtworkTileProps {
  artwork: Artwork
  onOpen: () => void
  /** First rows of the grid load eagerly to keep LCP low. */
  priority?: boolean
  index?: number
  sizes?: string
  /**
   * Gates the scroll reveal until after first paint. Without it framer observes
   * before layout and every tile reveals at once — see `useAfterPaint`.
   */
  revealReady?: boolean
  /**
   * Set only for the tile currently morphing into the viewer. Exactly one tile
   * may carry this at a time — see the note in WorksPage.
   */
  layoutId?: string
}

/**
 * A gallery tile.
 *
 * Shows no caption, title, or metadata — the grid is pure visual browsing, and
 * the category chips above it do the labelling. The title still reaches
 * assistive tech through the button's accessible name, and appears in the
 * viewer once opened.
 */
export function ArtworkTile({
  artwork,
  onOpen,
  priority,
  index = 0,
  sizes,
  layoutId,
  revealReady = true,
}: ArtworkTileProps) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <motion.li
      className={styles.cell}
      /**
       * Reveals on scroll, not on mount. With twenty-plus pieces a mount
       * animation fires everything at once, so every tile below the fold has
       * finished animating before the visitor ever reaches it.
       */
      initial={{
        // Fully visible under reduced motion: a scroll-gated fade would leave
        // the gallery blank below the fold for those users.
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 20,
        scale: reduceMotion ? 1 : 0.97,
      }}
      whileInView={revealReady ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={VIEWPORT}
      transition={tileReveal(reduceMotion, index)}
    >
      <button type="button" onClick={onOpen} className={styles.tile}>
        <ArtImage
          image={artwork.cover}
          priority={priority}
          sizes={sizes}
          layoutId={layoutId}
          className={styles.image}
        />
        <span className={styles.overlay} aria-hidden="true">
          <span className={styles.cue}>
            <Icon name="expand" size={16} />
          </span>
        </span>
        {/* The tile shows no text, so the button needs its name from here. */}
        <span className="visually-hidden">
          {artwork.title} — {pages.works.openHint}
        </span>
      </button>
    </motion.li>
  )
}
