import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { CATEGORY_LABELS, type Artwork } from '@/types/content'
import { viewer } from '@/data/site'
import { useScrollLock } from '@/hooks/useScrollLock'
import { SPRING_SOFT, EASE_OUT } from '@/lib/motion'
import { Icon, Tabs } from '@/components/ui'
import styles from './ArtworkLightbox.module.css'

interface ArtworkLightboxProps {
  items: readonly Artwork[]
  /** Index to open at. `null` closes. */
  openIndex: number | null
  onClose: () => void
  /** Fires on every selection change so the page can mirror it into the URL. */
  onNavigate: (artwork: Artwork, index: number) => void
  /**
   * Shared-layout id matching the grid tile that opened the viewer, so the
   * thumbnail morphs into the fullscreen image. Undefined once the visitor has
   * paged to a different piece — see the note in WorksPage about why exactly
   * one tile may hold this at a time.
   */
  morphLayoutId?: string
}

/** Horizontal drag distance past which a swipe registers. */
const SWIPE_THRESHOLD = 60

/**
 * Fullscreen artwork viewer.
 *
 * The artwork fills the viewport; all chrome (title bar, arrows, variant pills,
 * thumbnail rail) is overlaid on top of it and sits on gradient scrims, so it
 * stays legible over artwork of any brightness.
 *
 * It is a modal dialog: focus moves in on open, is trapped across Tab, and
 * returns to the tile that opened it. Escape closes, background scroll locks.
 *
 * Rendered through a portal to `document.body`. That is load-bearing: the
 * gallery page sets `isolation: isolate` (for its ornament blobs), which would
 * otherwise scope this `z-index` inside the page and let the sticky header
 * paint over a supposedly fullscreen viewer.
 */
export function ArtworkLightbox({
  items,
  openIndex,
  onClose,
  onNavigate,
  morphLayoutId,
}: ArtworkLightboxProps) {
  const isOpen = openIndex !== null
  const [index, setIndex] = useState(openIndex ?? 0)
  const [variantId, setVariantId] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)

  const reduceMotion = useReducedMotion()
  const idBase = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  /** The element focused before opening, so focus can be handed back. */
  const returnFocusRef = useRef<Element | null>(null)

  useScrollLock(isOpen)

  // Sync to the index the grid asked for.
  const [lastOpenIndex, setLastOpenIndex] = useState(openIndex)
  if (openIndex !== lastOpenIndex) {
    setLastOpenIndex(openIndex)
    if (openIndex !== null) {
      setIndex(openIndex)
      setVariantId(null)
      setDirection(0)
    }
  }

  const active = items[index]

  const select = useCallback(
    (next: number) => {
      if (items.length === 0) return
      const bounded = (next + items.length) % items.length
      setDirection(bounded > index ? 1 : -1)
      setIndex(bounded)
      // A different piece may not have the previously selected variant.
      setVariantId(null)
      const target = items[bounded]
      if (target) onNavigate(target, bounded)
    },
    [index, items, onNavigate],
  )

  const step = useCallback((delta: number) => select(index + delta), [index, select])

  // Capture the opener and move focus into the dialog.
  useEffect(() => {
    if (!isOpen) return
    returnFocusRef.current = document.activeElement
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  // Hand focus back to the tile that opened the viewer.
  useEffect(() => {
    if (isOpen) return
    const opener = returnFocusRef.current
    if (opener instanceof HTMLElement) opener.focus()
  }, [isOpen])

  // Escape to close, arrows to page, and a focus trap across Tab.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
        return
      }
      if (event.key !== 'Tab') return

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, step])

  // Keep the selected thumbnail in view as the rail scrolls.
  useEffect(() => {
    if (!isOpen) return
    railRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      })
  }, [index, isOpen, reduceMotion])

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < SWIPE_THRESHOLD) return
    step(info.offset.x < 0 ? 1 : -1)
  }

  const handleRailKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    select(event.key === 'Home' ? 0 : items.length - 1)
    requestAnimationFrame(() => {
      railRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus()
    })
  }

  const hasVariants = (active?.variants?.length ?? 0) > 1
  const activeVariantId = variantId ?? active?.variants?.[0]?.id
  const displayed =
    active?.variants?.find((variant) => variant.id === variantId)?.image ?? active?.cover
  const variantPanelId = `${idBase}-variant-panel`

  const enterX = reduceMotion ? 0 : direction >= 0 ? 48 : -48
  const exitX = reduceMotion ? 0 : direction >= 0 ? -48 : 48

  /**
   * Morph only while showing the piece that was actually clicked, and only its
   * cover. Switching variants swaps in a different file, so carrying the tile's
   * id across would try to morph between two unrelated images.
   */
  const morphId = morphLayoutId && !variantId ? morphLayoutId : undefined
  const isMorphing = Boolean(morphId)

  return createPortal(
    <AnimatePresence>
      {isOpen && active && displayed ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${viewer.label}: ${active.title}`}
          className={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          {/* Clicking the empty space around the artwork dismisses. The image
              and every control stop propagation by sitting above this. */}
          <button
            type="button"
            className={styles.dismissArea}
            onClick={onClose}
            tabIndex={-1}
            aria-hidden="true"
          />

          <motion.div
            className={styles.stage}
            drag={reduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            id={hasVariants ? variantPanelId : undefined}
            role={hasVariants ? 'tabpanel' : undefined}
            aria-labelledby={
              hasVariants && activeVariantId
                ? `${idBase}-variant-tab-${activeVariantId}`
                : undefined
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={displayed.src}
                layoutId={morphId}
                src={displayed.src}
                alt={displayed.alt}
                className={styles.art}
                // Drives `image-rendering` — pixel art must not be smoothed.
                data-category={active.category}
                draggable={false}
                /**
                 * While morphing, the shared-layout projection owns the
                 * movement. An enter offset on top of it fights the projection
                 * and the image arrives from the wrong place, so
                 * `initial={false}` hands control over entirely.
                 */
                initial={isMorphing ? false : { opacity: 0, x: enterX }}
                animate={isMorphing ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={isMorphing ? { opacity: 1 } : { opacity: 0, x: exitX }}
                transition={
                  isMorphing
                    ? SPRING_SOFT
                    : { duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }
                }
              />
            </AnimatePresence>
          </motion.div>

          {/* ------------------------------------------------------ top bar */}
          <div className={styles.topBar}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>{active.title}</h2>
              <p className={styles.meta}>
                {CATEGORY_LABELS[active.category]}
                {active.year ? (
                  <>
                    <span className={styles.dot} aria-hidden="true" />
                    {active.year}
                  </>
                ) : null}
              </p>
            </div>

            <div className={styles.topActions}>
              <p className={styles.counter} aria-hidden="true">
                {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className={styles.close}
                aria-label={viewer.close}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------- arrows */}
          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                className={`${styles.navButton} ${styles.navPrev}`}
                aria-label={viewer.previous}
              >
                <Icon name="arrow-left" size={22} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className={`${styles.navButton} ${styles.navNext}`}
                aria-label={viewer.next}
              >
                <Icon name="arrow-right" size={22} />
              </button>
            </>
          ) : null}

          {/* --------------------------------------------------- bottom bar */}
          <div className={styles.bottomBar}>
            {hasVariants && active.variants ? (
              <Tabs
                items={active.variants.map(({ id, label }) => ({ id, label }))}
                value={activeVariantId ?? active.variants[0]!.id}
                onChange={setVariantId}
                label={`${active.title} — ${viewer.variantsLabel}`}
                idBase={`${idBase}-variant`}
                appearance="pill"
                className={styles.variantTabs}
              />
            ) : null}

            {items.length > 1 ? (
              <div
                ref={railRef}
                role="tablist"
                aria-label={viewer.railLabel}
                onKeyDown={handleRailKeyDown}
                className={styles.rail}
              >
                {items.map((item, itemIndex) => {
                  const selected = itemIndex === index
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={item.title}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(itemIndex)}
                      className={styles.thumb}
                    >
                      <img
                        src={item.cover.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={styles.thumbImage}
                      />
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <p className="visually-hidden" role="status" aria-live="polite">
            {`${active.title}, ${index + 1} of ${items.length}`}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
