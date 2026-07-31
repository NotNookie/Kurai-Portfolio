import { useState } from 'react'
import type { ArtworkImage } from '@/types/content'
import styles from './ArtImage.module.css'

interface ArtImageProps {
  image: ArtworkImage
  /**
   * `true` only for images above the fold (the hero, the first gallery row).
   * Everything else stays lazy — a portfolio is mostly large artwork and eager
   * loading the whole grid is the fastest way to a slow first paint.
   */
  priority?: boolean
  /** `contain` preserves full artwork; `cover` fills a fixed frame. */
  fit?: 'cover' | 'contain'
  /** Overrides the intrinsic ratio, e.g. to force a uniform grid. */
  aspect?: string
  sizes?: string
  className?: string
}

/**
 * Artwork renderer.
 *
 * Reserves the frame from the declared aspect ratio before the file decodes,
 * so gallery pages never reflow as images arrive, and fades each piece in once
 * it has actually painted.
 */
export function ArtImage({
  image,
  priority = false,
  fit = 'cover',
  aspect,
  sizes,
  className,
}: ArtImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: aspect ?? image.aspect }}
      data-loaded={loaded}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        // `high` on the hero measurably improves LCP; the rest can wait.
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        // A cached image can finish before React attaches onLoad; catch that
        // case on mount so the fade-in cannot get stuck at opacity 0.
        ref={(node) => {
          if (node?.complete) setLoaded(true)
        }}
        className={styles.image}
        style={{ objectFit: fit }}
      />
    </div>
  )
}
