import { motion, useReducedMotion } from 'framer-motion'
import type { Artwork } from '@/types/content'
import { pages } from '@/data/site'
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
}

/**
 * A gallery tile.
 *
 * Shows no caption, title, or metadata — the reference site's grid is pure
 * visual browsing, and titles under anime artwork add noise without adding
 * information. The title still reaches assistive tech through the button's
 * accessible name, and appears in the lightbox once opened.
 */
export function ArtworkTile({
  artwork,
  onOpen,
  priority,
  index = 0,
  sizes,
}: ArtworkTileProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.li
      className={styles.cell}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.28),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <button type="button" onClick={onOpen} className={styles.tile}>
        <ArtImage
          image={artwork.cover}
          priority={priority}
          sizes={sizes}
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
