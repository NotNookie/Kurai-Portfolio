/**
 * Content model.
 *
 * One collection. Works and Illustrations used to be separate types with
 * separate pages; they are now a single filtered gallery, and the lightbox is
 * the only detail view — so there is exactly one artwork shape.
 *
 * These types are the contract between `src/data/*` and every component.
 * Components read through `src/lib/content.ts`, never from the data files, which
 * is what lets the whole layer be swapped for a CMS without touching a
 * component. See README "Handing the content over to Kurai".
 */

/** Drives the hashtag filter row on the gallery. */
export type ArtworkCategory =
  | 'character-design'
  | 'illustration'
  | 'chibi'
  | 'emote'
  | 'environment'
  | 'editorial'

/** Human labels for {@link ArtworkCategory}. Keep exhaustive. */
export const CATEGORY_LABELS: Record<ArtworkCategory, string> = {
  'character-design': 'Character Design',
  illustration: 'Illustration',
  chibi: 'Chibi',
  emote: 'Emote',
  environment: 'Environment',
  editorial: 'Editorial',
}

/**
 * Intrinsic aspect ratio as a CSS `aspect-ratio` value ("3 / 4").
 * Required so grid cells reserve space before the image decodes — this is what
 * keeps layout shift at zero while a gallery of large artwork loads.
 */
export type AspectRatio = `${number} / ${number}`

/** A single image plus what is needed to render it accessibly. */
export interface ArtworkImage {
  /** Absolute path from the web root, e.g. `/art/gallery/sakura.webp`. */
  readonly src: string
  /**
   * Describes what is depicted, for someone who cannot see it. Never just the
   * title. Empty string only when the image is purely decorative.
   */
  readonly alt: string
  readonly aspect: AspectRatio
}

/** Alternate art for one piece — line vs colour, outfit swaps, chibi versions. */
export interface ArtworkVariant {
  readonly id: string
  readonly label: string
  readonly image: ArtworkImage
}

/** A spec row in the lightbox, rendered as a definition list. */
export interface ArtworkDetail {
  readonly label: string
  readonly value: string
}

/**
 * One piece of artwork.
 *
 * Appears as a tile in the gallery grid; opening it shows the lightbox, which
 * is where `eyebrow`, `description`, `variants` and `details` are used. The grid
 * itself shows no captions, matching the reference site.
 */
export interface Artwork {
  /** URL-safe id, unique across the collection. Used in `?piece=`. */
  readonly slug: string
  readonly title: string
  readonly year: number
  readonly category: ArtworkCategory
  readonly cover: ArtworkImage
  /** Small label above the title in the lightbox, e.g. "Original Character". */
  readonly eyebrow: string
  /** Blurb in the lightbox panel. Around 40 words; the panel is fixed height. */
  readonly description: string
  readonly variants?: readonly ArtworkVariant[]
  readonly details?: readonly ArtworkDetail[]
  /** Promotes the piece into the home page marquee. */
  readonly featured?: boolean
}

/** Where a social link is allowed to surface. */
export type SocialPlacement = 'header' | 'footer' | 'contact'

export interface SocialLink {
  readonly id: string
  readonly label: string
  /** Handle shown beside the label, e.g. "@KekManeuver". */
  readonly handle?: string
  readonly href: string
  readonly icon: IconName
  readonly placements: readonly SocialPlacement[]
  /** Renders as the primary commission call to action. */
  readonly primary?: boolean
  /** One line explaining what the link is for, shown on the contact page. */
  readonly note?: string
}

export type IconName =
  | 'x'
  | 'instagram'
  | 'twitch'
  | 'bluesky'
  | 'vgen'
  | 'mail'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'menu'
  | 'external'
  | 'expand'

/** A nav destination. */
export interface NavItem {
  readonly label: string
  readonly to: string
}
