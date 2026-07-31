import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { CATEGORY_LABELS, type Artwork } from '@/types/content'
import { viewer } from '@/data/site'
import { useScrollLock } from '@/hooks/useScrollLock'
import { Icon, Tabs } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import styles from './ArtworkLightbox.module.css'

interface ArtworkLightboxProps {
  items: readonly Artwork[]
  /** Index to open at. `null` closes. */
  openIndex: number | null
  onClose: () => void
  /** Fires on every selection change so the page can mirror it into the URL. */
  onNavigate: (artwork: Artwork, index: number) => void
}

/** Horizontal drag distance past which a swipe registers. */
const SWIPE_THRESHOLD = 60

/**
 * Full-screen artwork viewer, modelled on Genshin Impact's character pages:
 * splash art, an information panel, variant tabs, and a thumbnail rail.
 *
 * This is the only detail view — there are no per-artwork routes. It is a modal
 * dialog, so it traps focus, locks background scroll, closes on Escape, and
 * restores focus to the tile that opened it.
 */
export function ArtworkLightbox({
  items,
  openIndex,
  onClose,
  onNavigate,
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

  // Sync to the index the grid asked for, and remember where focus came from.
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
    // Focus the close button rather than the dialog, so the first Tab lands
    // somewhere predictable and Escape is immediately discoverable.
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

      // Focus trap: cycle within the dialog rather than escaping to the page
      // behind, which is inert to sighted users but still tabbable without this.
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
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
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

  const enterX = reduceMotion ? 0 : direction >= 0 ? 44 : -44
  const exitX = reduceMotion ? 0 : direction >= 0 ? -44 : 44

  return (
    <AnimatePresence>
      {isOpen && active && displayed ? (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          // Click-outside to dismiss; the panel stops propagation below.
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${viewer.label}: ${active.title}`}
            className={styles.dialog}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, y: reduceMotion ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Blob tone="cyan" placement="top-left" scale={1.2} />
            <Blob tone="pink" placement="bottom-right" scale={1.35} />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={styles.close}
              aria-label={viewer.close}
            >
              <Icon name="close" size={20} />
            </button>

            <div className={styles.layout}>
              <div className={styles.info}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.slug}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className={styles.eyebrow}>{active.eyebrow}</p>
                    <h2 className={styles.name}>{active.title}</h2>
                    <p className={styles.description}>{active.description}</p>

                    <dl className={styles.details}>
                      {active.details?.map((detail) => (
                        <div key={detail.label} className={styles.detailRow}>
                          <dt className={styles.detailLabel}>{detail.label}</dt>
                          <dd className={styles.detailValue}>{detail.value}</dd>
                        </div>
                      ))}
                      <div className={styles.detailRow}>
                        <dt className={styles.detailLabel}>Category</dt>
                        <dd className={styles.detailValue}>
                          {CATEGORY_LABELS[active.category]}
                        </dd>
                      </div>
                    </dl>
                  </motion.div>
                </AnimatePresence>

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
              </div>

              <motion.div
                className={styles.artArea}
                id={hasVariants ? variantPanelId : undefined}
                role={hasVariants ? 'tabpanel' : undefined}
                aria-labelledby={
                  hasVariants && activeVariantId
                    ? `${idBase}-variant-tab-${activeVariantId}`
                    : undefined
                }
                drag={reduceMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={handleDragEnd}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={displayed.src}
                    src={displayed.src}
                    alt={displayed.alt}
                    className={styles.art}
                    draggable={false}
                    initial={{ opacity: 0, x: enterX }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: exitX }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            <div className={styles.railWrap}>
              <button
                type="button"
                onClick={() => step(-1)}
                className={styles.navButton}
                aria-label={viewer.previous}
              >
                <Icon name="arrow-left" size={18} />
              </button>

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

              <button
                type="button"
                onClick={() => step(1)}
                className={styles.navButton}
                aria-label={viewer.next}
              >
                <Icon name="arrow-right" size={18} />
              </button>
            </div>

            <p className="visually-hidden" role="status" aria-live="polite">
              {`${active.title}, ${index + 1} of ${items.length}`}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
