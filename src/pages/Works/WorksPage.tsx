import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pages } from '@/data/site'
import { getArtworks, indexOfSlug } from '@/lib/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Container } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import { ArtworkTile } from '@/components/art/ArtworkTile/ArtworkTile'
import { ArtworkLightbox } from '@/components/art/ArtworkLightbox/ArtworkLightbox'
import type { Artwork } from '@/types/content'
import styles from './WorksPage.module.css'

/**
 * The gallery — one grid for the whole body of work.
 *
 * There are no category filters and the tiles carry no captions: browsing here
 * is purely visual. The open piece lives in the query string, so an individual
 * artwork is a shareable URL that survives a refresh and works with the back
 * button.
 */
export function WorksPage() {
  useDocumentTitle(pages.works.title)

  const [searchParams, setSearchParams] = useSearchParams()
  const artworks = getArtworks()

  const openIndex = indexOfSlug(artworks, searchParams.get('piece'))
  const resolvedOpenIndex = openIndex === -1 ? null : openIndex

  const openPiece = (artwork: Artwork) => setSearchParams({ piece: artwork.slug })

  const closePiece = useCallback(
    // `replace` so closing does not stack a history entry on top of opening.
    () => setSearchParams({}, { replace: true }),
    [setSearchParams],
  )

  const navigatePiece = useCallback(
    (artwork: Artwork) => setSearchParams({ piece: artwork.slug }, { replace: true }),
    [setSearchParams],
  )

  return (
    <div className={styles.page}>
      <Blob tone="cyan" placement="top-right" scale={1.5} />
      <Blob tone="pink" placement="center-left" scale={1.2} />

      <Container>
        <header className={styles.header}>
          <h1 className={styles.heading}>{pages.works.heading}</h1>
          <p className={styles.intro}>{pages.works.intro}</p>
        </header>

        {artworks.length === 0 ? (
          <p className={styles.empty}>{pages.works.emptyMessage}</p>
        ) : (
          // Column count is capped so every column holds at least two pieces.
          // CSS multi-column balances by height, so a small collection spread
          // across four columns stranded single items and left an obvious hole:
          // six pieces produced a full first row, then two orphans in columns
          // one and four. Resolves to four columns from eight pieces up.
          <ul
            className={styles.grid}
            role="list"
            style={
              {
                '--grid-columns': Math.max(1, Math.min(4, Math.floor(artworks.length / 2))),
              } as React.CSSProperties
            }
          >
            {artworks.map((artwork, index) => (
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
        items={artworks}
        openIndex={resolvedOpenIndex}
        onClose={closePiece}
        onNavigate={navigatePiece}
      />
    </div>
  )
}

export default WorksPage
