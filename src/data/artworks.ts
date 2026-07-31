import type { Artwork } from '@/types/content'

/**
 * The entire gallery. One flat list — the grid, the filters, the home marquee
 * and the lightbox all read from here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  TODO(kurai): these entries reuse the three images currently in the repo so
 *  the layout can be judged with real artwork in it. Titles and descriptions
 *  are placeholders. Replace them as real pieces are added.
 *
 *  To add a piece:
 *    1. Drop the image in `public/art/gallery/`
 *    2. Copy an entry below and change slug / title / year / category / cover
 *    3. `aspect` must match the real image ratio, or the grid will jump as it
 *       loads. Check the file's dimensions if you are unsure.
 *    4. `featured: true` puts it in the scrolling strip on the home page
 *
 *  `variants` and `details` are optional. Supply `variants` only when a piece
 *  genuinely has alternate art — the tabs hide themselves when it is absent.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const artworks: readonly Artwork[] = [
  {
    slug: 'sakura-drift',
    title: 'Sakura Drift',
    eyebrow: 'Original Character',
    year: 2024,
    category: 'character-design',
    featured: true,
    cover: {
      src: '/art/gallery/sakura-drift.png',
      alt: 'Illustrated portrait of a character with long purple hair and round glasses holding a stylus, against a pink and sky-blue polka-dot background.',
      aspect: '16 / 9',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    variants: [
      {
        id: 'standard',
        label: 'Standard',
        image: {
          src: '/art/gallery/sakura-drift.png',
          alt: 'Standard colour version of the illustration.',
          aspect: '16 / 9',
        },
      },
      {
        id: 'chibi',
        label: 'Chibi',
        image: {
          src: '/art/gallery/winter-charm.png',
          alt: 'Chibi version of the same character wearing a santa hat.',
          aspect: '1 / 1',
        },
      },
    ],
    details: [
      { label: 'Medium', value: 'Digital' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    slug: 'winter-charm',
    title: 'Winter Charm',
    eyebrow: 'Seasonal',
    year: 2024,
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/winter-charm.png',
      alt: 'Chibi character with purple hair, round green glasses, and a red santa hat.',
      aspect: '1 / 1',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    details: [
      { label: 'Medium', value: 'Digital' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    slug: 'nookie',
    title: 'Nookie',
    eyebrow: 'Commission',
    year: 2024,
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/nookie.png',
      alt: 'Chibi character with short brown hair wearing a santa hat and a gingerbread-patterned sweater.',
      aspect: '1 / 1',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    details: [
      { label: 'Medium', value: 'Digital' },
      { label: 'Year', value: '2024' },
    ],
  },
  {
    slug: 'reference-sheet-study',
    title: 'Reference Sheet Study',
    eyebrow: 'Character Design',
    year: 2023,
    category: 'character-design',
    featured: true,
    cover: {
      src: '/art/gallery/sakura-drift.png',
      alt: 'Placeholder: character illustration standing in for a reference sheet layout.',
      aspect: '16 / 9',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    details: [{ label: 'Year', value: '2023' }],
  },
  {
    slug: 'emote-set',
    title: 'Emote Set',
    eyebrow: 'Stream Package',
    year: 2023,
    category: 'emote',
    featured: true,
    cover: {
      src: '/art/gallery/nookie.png',
      alt: 'Placeholder: chibi character standing in for a set of stream emotes.',
      aspect: '1 / 1',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    details: [{ label: 'Year', value: '2023' }],
  },
  {
    slug: 'portrait-commission',
    title: 'Portrait Commission',
    eyebrow: 'Commission',
    year: 2023,
    category: 'illustration',
    featured: true,
    cover: {
      src: '/art/gallery/winter-charm.png',
      alt: 'Placeholder: chibi portrait standing in for a bust commission.',
      aspect: '1 / 1',
    },
    description:
      'TODO(kurai): about 40 words on this piece — what it is, what you were exploring, anything worth pointing out.',
    details: [{ label: 'Year', value: '2023' }],
  },
]
