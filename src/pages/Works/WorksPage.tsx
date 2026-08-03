import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pages } from '@/data/site'
import { getArtworks, getUsedCategories, indexOfSlug } from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAfterPaint } from '@/hooks/useAfterPaint'
import { Container, RevealText } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import { ArtworkTile } from '@/components/art/ArtworkTile/ArtworkTile'
import { ArtworkLightbox } from '@/components/art/ArtworkLightbox/ArtworkLightbox'
import type { Artwork } from '@/types/content'
import styles from './WorksPage.module.css'

const ALL = 'all'

/**
 * The gallery — one filtered grid for the whole body of work.
 *
 * Tiles stay captionless; the category chips do the labelling. Both the active
 * filter and the open piece live in the query string, so a filtered view and an
 * individual artwork are each a shareable URL that survives a refresh and works
 * with the back button.
 */
export function WorksPage() {
  useDocumentTitle(pages.works.title)

  const [searchParams, setSearchParams] = useSearchParams()
  const categories = getUsedCategories()

  /**
   * The slug currently allowed to morph between its grid tile and the viewer.
   *
   * Exactly one tile may carry the shared-layout id at a time, or framer-motion
   * has two candidates for the same id and picks arbitrarily. So it is set when
   * a tile is clicked, and cleared as soon as the visitor pages to a different
   * piece — after that the viewer crossfades instead. It is deliberately NOT
   * cleared on close, because the morph back to the tile needs the id to still
   * be there while the viewer exits. It also starts undefined, so arriving on a
   * `?piece=` deep link fades in rather than morphing from a tile the visitor
   * never clicked.
   */
  const [morphSlug, setMorphSlug] = useState<string | null>(null)

  /** One frame's grace so the masonry has laid out before tiles are observed. */
  const revealReady = useAfterPaint()

  const requested = searchParams.get('category') ?? ALL
  // Guard against a hand-edited or stale URL naming a category that no longer
  // has any artwork in it — otherwise the grid would render empty.
  const activeCategory = categories.some((c) => c.id === requested) ? requested : ALL

  const visible = useMemo(
    () =>
      getArtworks().filter((art) => activeCategory === ALL || art.category === activeCategory),
    [activeCategory],
  )

  /**
   * The lightbox pages through the *filtered* list, so arrowing from a chibi
   * never lands on a pixel piece the visitor has filtered out.
   */
  const openIndex = indexOfSlug(visible, searchParams.get('piece'))
  const resolvedOpenIndex = openIndex === -1 ? null : openIndex

  const setParams = useCallback(
    (next: { category?: string; piece?: string }, replace = false) => {
      const params = new URLSearchParams()
      if (next.category && next.category !== ALL) params.set('category', next.category)
      if (next.piece) params.set('piece', next.piece)
      setSearchParams(params, { replace })
    },
    [setSearchParams],
  )

  const selectCategory = (id: string) => setParams({ category: id }, true)

  const openPiece = (artwork: Artwork) => {
    setMorphSlug(artwork.slug)
    setParams({ category: activeCategory, piece: artwork.slug })
  }

  const closePiece = useCallback(
    // `replace` so closing does not stack a history entry on top of opening.
    () => setParams({ category: activeCategory }, true),
    [activeCategory, setParams],
  )

  const navigatePiece = useCallback(
    (artwork: Artwork) => {
      // Past the first piece there is no tile to morph from or back to.
      setMorphSlug(null)
      setParams({ category: activeCategory, piece: artwork.slug }, true)
    },
    [activeCategory, setParams],
  )

  return (
    <div className={styles.page}>
      <Blob tone="cyan" placement="top-right" scale={1.5} />
      <Blob tone="pink" placement="center-left" scale={1.2} />

      <Container>
        <header className={styles.header}>
          <RevealText as="h1" className={styles.heading} trigger="mount" stagger={0.06}>
            {pages.works.heading}
          </RevealText>
          <p className={styles.intro}>{pages.works.intro}</p>
        </header>

        {categories.length > 1 ? (
          <div className={styles.filters} role="group" aria-label={pages.works.filterLegend}>
            <button
              type="button"
              onClick={() => selectCategory(ALL)}
              aria-pressed={activeCategory === ALL}
              className={styles.filter}
            >
              {pages.works.filterAllLabel}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={styles.filter}
              >
                {category.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Announces the new count when the filter changes. */}
        <p className="visually-hidden" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'piece' : 'pieces'} shown
        </p>

        {visible.length === 0 ? (
          <p className={styles.empty}>{pages.works.emptyMessage}</p>
        ) : (
          // Column count is capped so every column holds at least two pieces.
          // CSS multi-column balances by height, so a small set spread across
          // four columns stranded single items and left an obvious hole. Driven
          // by the *filtered* count, so narrowing the grid re-columns it too.
          <ul
            className={styles.grid}
            role="list"
            style={
              {
                '--grid-columns': Math.max(1, Math.min(4, Math.floor(visible.length / 2))),
              } as React.CSSProperties
            }
          >
            {visible.map((artwork, index) => (
              <ArtworkTile
                key={artwork.slug}
                artwork={artwork}
                index={index}
                priority={index < 4}
                onOpen={() => openPiece(artwork)}
                revealReady={revealReady}
                layoutId={artwork.slug === morphSlug ? `art-${artwork.slug}` : undefined}
                sizes="(max-width: 40rem) 50vw, (max-width: 68rem) 33vw, 25vw"
              />
            ))}
          </ul>
        )}
      </Container>

      <ArtworkLightbox
        items={visible}
        openIndex={resolvedOpenIndex}
        onClose={closePiece}
        onNavigate={navigatePiece}
        morphLayoutId={morphSlug ? `art-${morphSlug}` : undefined}
      />
    </div>
  )
}

export default WorksPage
