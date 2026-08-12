import type { Artwork } from '@/types/content'

/**
 * The entire gallery. One flat list — the grid, the home marquee and the
 * lightbox all read from here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  To add a piece:
 *    1. Drop the image in `public/art/gallery/`. Use a lowercase, hyphenated
 *       filename with no spaces — spaces need URL-encoding and an uppercase
 *       extension breaks on case-sensitive hosting.
 *    2. Copy an entry below and change slug / title / category / cover.
 *    3. `aspect` is written as the image's real pixel dimensions, e.g.
 *       '2048 / 3048'. Exact values mean the grid reserves the right space and
 *       never jumps as images load.
 *    4. `featured: true` puts it in the scrolling rows on the home page.
 *
 *  `year`, `eyebrow` and `description` are all optional. Nothing renders
 *  `eyebrow` or `description` today, and the viewer hides the year line when
 *  it is absent — so leave them out rather than guessing.
 *
 *  TODO(kurai): the years are unknown and deliberately omitted. Add
 *  `year: 2024` (or whichever) to any entry and it will appear in the viewer
 *  and drive the sort order.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const artworks: readonly Artwork[] = [
  /* ------------------------------------------------ rendered illustrations */
  {
    slug: 'blanc',
    title: 'Blanc',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/blancIllustration.webp',
      alt: 'Blond character with brown animal ears and dark brow markings, eyes closed and blushing, resting a finger against their chin, wearing a white shirt with brown suspenders against a sage green background.',
      width: 2048,
      height: 3048,
    },
  },
  {
    // TODO(kurai): no name is written in this piece — retitle if it has one.
    slug: 'bubbles',
    title: 'Bubbles',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/bubbleIllustration.webp',
      alt: 'Character with a dark blue bob and blue eyes touching their cheek, wearing a white camisole, against a blue-to-yellow background filled with soap bubbles.',
      width: 2480,
      height: 3508,
    },
  },
  {
    slug: 'caleb',
    title: 'Caleb',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/calebIllustration.webp',
      alt: 'Black-haired character with violet eyes smiling and blushing, wearing a blue sweater with a red apple patch, against an orange background framed by a dashed white border.',
      width: 2000,
      height: 2500,
    },
  },
  {
    // TODO(kurai): no name is written in this piece — retitle if it has one.
    slug: 'elf',
    title: 'Elf',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/elfIllustration.webp',
      alt: 'Green-haired elf shown in profile with eyes closed, a gold cuff on one pointed ear, wearing a lavender fur-trimmed garment, with green leaves drifting past.',
      width: 2480,
      height: 3508,
    },
  },
  {
    slug: 'lumine',
    title: 'Lumine',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/lumineIllustration.webp',
      alt: 'Blond character with a pale blue flower hairpin winking, wearing a white and brown sleeveless top, with a small blue heart beside them.',
      width: 1080,
      height: 1080,
    },
  },
  {
    slug: 'masukatto',
    title: 'Masukatto',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/masukattoIllustration.webp',
      alt: 'Green-haired character in a green sweater vest over a collared shirt, against a white background scattered with green grapes.',
      width: 3000,
      height: 4000,
    },
  },
  {
    slug: 'nero-spade',
    title: 'Nero Spade',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/neroIllustration.webp',
      alt: 'White-haired character with dark skin and red eyes, wearing a black top with a brush-lettered graphic, a silver chain, and a white fur-trimmed jacket, against a deep pink background.',
      width: 2000,
      height: 2500,
    },
  },
  {
    slug: 'quincy',
    title: 'Quincy',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/quincyIllustration.webp',
      alt: 'Aqua-haired character with violet eyes holding both hands to their cheeks in surprise, wearing a blue ruffled dress, against a black background with gold stars.',
      width: 2480,
      height: 3508,
    },
  },
  {
    slug: 'rafayel',
    title: 'Rafayel',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/rafayelIlustration.webp',
      alt: 'Character with purple hair, pink highlights and blue eyes smiling gently, wearing a white pinstriped shirt, against a lavender background.',
      width: 1600,
      height: 2000,
    },
  },
  {
    slug: 'ringo',
    title: 'Ringo',
    category: 'rendered-illustration',
    featured: true,
    cover: {
      src: '/art/gallery/ringoIllustration.webp',
      alt: 'Red-haired character with green eyes and bear ears grinning, wrapped in an apple-patterned cape, against a background of apple slices.',
      width: 721,
      height: 897,
    },
  },

  /* ------------------------------------------------------------- chibis */
  {
    slug: 'chibi-kurai',
    title: 'Chibi Kurai',
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/chibikurai.webp',
      alt: 'Chibi of Hellane Kurai with long purple hair, round green glasses and a red santa hat.',
      width: 512,
      height: 512,
    },
  },
  {
    slug: 'chibi-nookie',
    title: 'Chibi Nookie',
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/chibinookie.webp',
      alt: 'Chibi with short brown hair wearing a red santa hat and a gingerbread-patterned sweater.',
      width: 512,
      height: 512,
    },
  },
  {
    slug: 'chibi-vic',
    title: 'Chibi Vic',
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/chibivic.webp',
      alt: 'Chibi with black hair and reindeer antlers wearing a blue winter cape.',
      width: 512,
      height: 512,
    },
  },
  {
    // TODO(kurai): the file is named "chibiOri" but the artwork is signed
    // "auwii" — confirm which name this character goes by.
    slug: 'chibi-auwii',
    title: 'Chibi Auwii',
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/chibiOri.webp',
      alt: 'Chibi with long black hair and gold hoop earrings, wearing a red santa hat and a red strawberry-patterned top.',
      width: 512,
      height: 512,
    },
  },
  {
    slug: 'valentines-day',
    title: "Valentine's Day",
    category: 'chibi',
    featured: true,
    cover: {
      src: '/art/gallery/chibi_valentine_vicandori.webp',
      alt: "Valentine's illustration: two chibis labelled Vick and auwii inside a red heart frame, with otter mascots holding fish beneath a blue ribbon.",
      width: 2000,
      height: 2000,
    },
  },

  /* ---------------------------------------------------------- pixel art */
  {
    slug: 'elf-pixel',
    title: 'Elf',
    category: 'pixel-art',
    featured: true,
    cover: {
      src: '/art/gallery/elfPixel.webp',
      alt: 'Pixel-art close-up of a green-haired elf with long pink pointed ears, gold ear cuffs and blushing cheeks.',
      width: 1760,
      height: 990,
    },
  },
  {
    slug: 'kurai-pixel',
    title: 'Kurai',
    category: 'pixel-art',
    featured: true,
    cover: {
      src: '/art/gallery/kuraiPixel.webp',
      alt: 'Pixel-art portrait of Hellane Kurai with purple hair, round glasses, a black choker with a blue gem, and a green top.',
      width: 768,
      height: 384,
    },
  },
  {
    slug: 'kukuraiii-pixel',
    title: 'Kukuraiii',
    category: 'pixel-art',
    featured: true,
    cover: {
      src: '/art/gallery/kukuraiii-pixel.png',
      alt: 'Pixel-art portrait of Hellane Kurai with cat ears and a striped tail, making a peace sign, wearing a green hoodie.',
      width: 768,
      height: 768,
    },
  },
  {
    // TODO(kurai): titled from the filename — rename if the character differs.
    slug: 'nookie-dog-pixel',
    title: 'Nookie Dog',
    category: 'pixel-art',
    featured: true,
    cover: {
      src: '/art/gallery/nookie-dog-pixel.png',
      alt: 'Pixel-art portrait of a character with black hair and orange side sections, wearing a red top.',
      width: 780,
      height: 778,
    },
  },
  {
    slug: 'nookie-pixel',
    title: 'Nookie',
    category: 'pixel-art',
    featured: true,
    cover: {
      src: '/art/gallery/nookie-pixel.png',
      alt: 'Pixel-art portrait of a freckled character with black hair smiling, wearing a blue shirt, with the name Nookie written beside them.',
      width: 384,
      height: 384,
    },
  },
]
