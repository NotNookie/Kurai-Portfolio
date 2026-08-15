import { useState } from 'react'
import { motion } from 'framer-motion'
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
  /**
   * Shared-layout id. When set, the <img> becomes a `motion.img` so it can
   * morph into another element carrying the same id — used to expand a gallery
   * tile into the fullscreen viewer. Left undefined the image stays a plain
   * <img>, so the other twenty tiles pay nothing for the feature.
   */
  layoutId?: string
}

/**
 * Artwork renderer.
 *
 * Reserves the frame from the file's real dimensions before it decodes, so
 * gallery pages never reflow as images arrive, and fades each piece in once it
 * has actually painted.
 *
 * The ratio is derived from `width`/`height` rather than declared separately —
 * a hand-written ratio is a second source of truth that can disagree with the
 * file, and this way it cannot.
 */
export function ArtImage({
  image,
  priority = false,
  fit = 'cover',
  aspect,
  sizes,
  className,
  layoutId,
}: ArtImageProps) {
  const [loaded, setLoaded] = useState(false)
  const ImageTag = layoutId ? motion.img : 'img'
  // A plain <img> must not receive `layoutId`; React warns about the unknown
  // attribute, so it is spread in only when the motion element is in play.
  const layoutProps = layoutId ? { layoutId } : {}

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: aspect ?? `${image.width} / ${image.height}` }}
      data-loaded={loaded}
    >
      <ImageTag
        {...layoutProps}
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        // `high` on the hero measurably improves LCP; the rest can wait.
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        /*
         * Casual-copy deterrents, deliberately scoped to artwork rather than
         * the page: suppressing the context menu everywhere is hostile, and
         * breaks ordinary things like copying a link or opening one in a tab.
         *
         * Worth being clear that this is a speed bump and nothing more. The
         * file is still in the network tab, still in view-source, and still on
         * screen for a screenshot. It stops an idle right-click → Save, which
         * is most of what casual reposting actually is.
         */
        // Hook for the print stylesheet — see global.css.
        data-artwork="true"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        draggable={false}
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
