import { artworks } from '@/data/artworks'
import { CATEGORY_LABELS, type Artwork, type ArtworkCategory } from '@/types/content'

/**
 * Read-only selectors over the content layer.
 *
 * Components import from here rather than from `src/data/*` directly, so the
 * shape of storage (a hand-written array today, CMS-generated JSON later) can
 * change without touching a single component.
 */

/**
 * Newest first, then alphabetical. `year` is optional, so undated pieces sort
 * after dated ones rather than being treated as year zero.
 */
const byYearDesc = (a: Artwork, b: Artwork) => {
  if (a.year !== b.year) {
    if (a.year === undefined) return 1
    if (b.year === undefined) return -1
    return b.year - a.year
  }
  return a.title.localeCompare(b.title)
}

export const getArtworks = (): readonly Artwork[] => [...artworks].sort(byYearDesc)

export const getFeatured = (limit = 12): readonly Artwork[] =>
  getArtworks()
    .filter((art) => art.featured)
    .slice(0, limit)

export const getArtworkBySlug = (slug: string): Artwork | undefined =>
  artworks.find((art) => art.slug === slug)

/**
 * Categories that actually have artwork in them, in the order declared on the
 * type. Driving the filter row from the data means an empty category can never
 * render a chip that leads to an empty grid.
 */
export const getUsedCategories = (): readonly { id: ArtworkCategory; label: string }[] => {
  const present = new Set(artworks.map((art) => art.category))
  return (Object.keys(CATEGORY_LABELS) as ArtworkCategory[])
    .filter((id) => present.has(id))
    .map((id) => ({ id, label: CATEGORY_LABELS[id] }))
}

/** Index within a given list, for opening the lightbox at the right piece. */
export const indexOfSlug = (list: readonly Artwork[], slug: string | null): number => {
  if (!slug) return -1
  return list.findIndex((art) => art.slug === slug)
}

/**
 * Dev-only integrity check. Duplicate slugs would silently break `?piece=`
 * deep links and React keys, and the failure mode — one piece shadowing another
 * — is easy to miss visually, so surface it the moment the data file is saved.
 */
if (import.meta.env.DEV) {
  const seen = new Set<string>()
  const duplicates = artworks
    .map((art) => art.slug)
    .filter((slug) => {
      if (seen.has(slug)) return true
      seen.add(slug)
      return false
    })
  if (duplicates.length > 0) {
    console.error(
      `[content] Duplicate slug(s) in artworks: ${[...new Set(duplicates)].join(', ')}. ` +
        `Slugs must be unique — the later entry is unreachable.`,
    )
  }
}
