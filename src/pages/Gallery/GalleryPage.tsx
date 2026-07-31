import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pages } from '@/data/site'
import { getArtworks, getUsedCategories, indexOfSlug } from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Container } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import { ArtworkTile } from '@/components/art/ArtworkTile/ArtworkTile'
import { ArtworkLightbox } from '@/components/art/ArtworkLightbox/ArtworkLightbox'
import type { Artwork } from '@/types/content'
import styles from './GalleryPage.module.css'

const ALL = 'all'

/**
 * The gallery — one filtered grid for the whole body of work.
 *
 * Both the active filter and the open piece live in the query string, so a
 * filtered view and an individual artwork are both shareable URLs that survive
 * a refresh and work with the back button.
 */
export function GalleryPage() {
  useDocumentTitle(pages.gallery.title)

  const [searchParams, setSearchParams] = useSearchParams()
  const categories = getUsedCategories()

  const requested = searchParams.get('category') ?? ALL
  // Guard against a hand-edited URL naming a category that no longer exists.
  const activeCategory = categories.some((c) => c.id === requested) ? requested : ALL

  const visible = useMemo(
    () =>
      getArtworks().filter(
        (art) => activeCategory === ALL || art.category === activeCategory,
      ),
    [activeCategory],
  )

  // The lightbox pages through the *filtered* list, so arrowing never jumps to
  // a piece the visitor has filtered out.
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

  const openPiece = (artwork: Artwork) =>
    setParams({ category: activeCategory, piece: artwork.slug })

  const closePiece = useCallback(
    // `replace` so closing does not add a history entry on top of opening.
    () => setParams({ category: activeCategory }, true),
    [activeCategory, setParams],
  )

  const navigatePiece = useCallback(
    (artwork: Artwork) => setParams({ category: activeCategory, piece: artwork.slug }, true),
    [activeCategory, setParams],
  )

  return (
    <div className={styles.page}>
      <Blob tone="cyan" placement="top-right" scale={1.5} />
      <Blob tone="pink" placement="center-left" scale={1.2} />

      <Container>
        <header className={styles.header}>
          <h1 className={styles.heading}>{pages.gallery.heading}</h1>
          <p className={styles.intro}>{pages.gallery.intro}</p>
        </header>

        <div className={styles.filters} role="group" aria-label={pages.gallery.filterLegend}>
          <button
            type="button"
            onClick={() => selectCategory(ALL)}
            aria-pressed={activeCategory === ALL}
            className={styles.filter}
          >
            <span aria-hidden="true">#</span>
            {pages.gallery.filterAllLabel}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={styles.filter}
            >
              <span aria-hidden="true">#</span>
              {category.label}
            </button>
          ))}
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'illustration' : 'illustrations'} shown
        </p>

        {visible.length === 0 ? (
          <p className={styles.empty}>{pages.gallery.emptyMessage}</p>
        ) : (
          <ul className={styles.grid} role="list">
            {visible.map((artwork, index) => (
              <ArtworkTile
                key={artwork.slug}
                artwork={artwork}
                index={index}
                priority={index < 4}
                onOpen={() => openPiece(artwork)}
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
      />
    </div>
  )
}

export default GalleryPage
