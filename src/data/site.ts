import type { NavItem } from '@/types/content'

/**
 * ALL user-facing copy lives here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  TODO(kurai): every string marked `TODO` below is a deliberately neutral
 *  placeholder. No biography, client list, location, years active, or awards
 *  has been invented — those would be false claims about a real person.
 *  Replace each one and delete the TODO comment above it.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Nothing here is referenced by string literal anywhere else, so rewriting a
 * value can never break a component.
 *
 * The site is English-only. If a second language is ever wanted, the shape to
 * reach for is `{ en: '…', ja: '…' }` per value — that is a change to this file
 * and a small accessor, not a rebuild.
 */

export const site = {
  name: 'Hellane Kurai',
  shortName: 'Kurai',
  role: 'Digital Artist',
  // TODO(kurai): ~150 characters, used for search results and link previews.
  description:
    'Portfolio of Hellane Kurai, digital artist — rendered illustrations, pixel art, chibis, plus commission information.',
  /** Set once the domain is live; used for canonical and share URLs. */
  url: '',
  /**
   * Stored in halves on purpose. Written whole, the address would sit in the
   * shipped JS as a literal that any scraper's /\S+@\S+/ matches on sight; kept
   * apart, there is no such string anywhere in the build. It is joined at
   * render time by `getEmail()` in `src/lib/email.ts` — read it before changing
   * this shape, and never reassemble the two halves in a data file.
   *
   * Set to null to hide the direct-contact block on the Contact page entirely.
   */
  email: { user: 'kuraihellane', domain: 'gmail.com' } as EmailParts | null,
  /**
   * TODO(kurai): update `value` AND `asOf` together whenever your availability
   * changes. `asOf` is the date you last confirmed it, in YYYY-MM-DD.
   *
   * After 30 days the site stops asserting the status and points at VGen
   * instead — a stale "Closed" costs nothing, but a stale "Open" means someone
   * writes to you and waits. See `src/lib/status.ts`.
   */
  commissionStatus: {
    value: 'Open' as CommissionStatus,
    asOf: '2026-08-03',
  },
  copyrightStartYear: 2024,
} as const

/** An address held in halves so it never appears whole. See `site.email`. */
export interface EmailParts {
  readonly user: string
  readonly domain: string
}

export type CommissionStatus = 'Open' | 'Waitlist' | 'Closed'

/** Copy for the commission status, shared by the About and Contact pages. */
export const commissions = {
  label: 'Commissions',
  /** Shown instead of the status once the declaration has aged out. */
  staleLabel: 'Check VGen for current slots',
} as const

export const nav: readonly NavItem[] = [
  { label: 'Works', to: '/works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/** Home hero — the mockup's "Featured Character" card, with Kurai as subject. */
export const hero = {
  eyebrow: 'Digital Artist',
  name: 'Hellane Kurai',
  backgroundAlt:
    'Illustrated self-portrait of Hellane Kurai: long purple hair, round glasses, green top, holding a stylus, against a pink and sky-blue polka-dot background.',
  /** Two framings of the same person, carried over from the mockup's tabs. */
  tabs: [
    {
      id: 'about',
      label: 'About',
      // TODO(kurai): 2–3 sentences. Who you are and what you draw.
      body: 'Digital artist working in a bright, expressive anime style — rendered illustrations, pixel art, chibis, and sketches.',
    },
    {
      id: 'commissions',
      label: 'Commissions',
      // TODO(kurai): 2–3 sentences. What you take on and how to book.
      body: 'Commissions are handled through VGen, where current slots, pricing tiers, and terms of service are always up to date.',
    },
  ],
  primaryCta: { label: 'See works', to: '/works' },
  secondaryCta: { label: 'Commission me', to: '/contact' },
} as const

export const pages = {
  works: {
    title: 'Works',
    heading: 'Works',
    /**
     * Noun for the visible piece count under the heading. There is deliberately
     * no intro sentence: the heading sits directly on the chips, which is what
     * gives the page its scale, and the chips already name the kinds of work.
     */
    countNoun: { one: 'piece', other: 'pieces' },
    emptyMessage: 'Nothing published yet.',
    /** Label for the chip that clears the category filter. */
    filterAllLabel: 'All',
    /** Accessible name for the filter row. */
    filterLegend: 'Filter works by category',
    /** Screen-reader hint on each tile, since tiles show no caption. */
    openHint: 'Open in viewer',
  },
  about: {
    title: 'About',
    heading: 'About',
    // TODO(kurai): your opening statement. One or two sentences, large type.
    lede: 'I draw characters — the kind people want to keep as a profile picture for years.',
    // TODO(kurai): your real bio. One string per paragraph, add as many as you like.
    body: [
      "I got into drawing because of my big brother. He always likes to doodle characters from Adventure Time and anime that he watched. I like drawing... probably just any character that I'm fond of~!",
      "I am a digital artist and I love art it's basically my life and career, I mostly do headshots to bust-up size.",
      "For my future clients I am still learning and would like to keep improving my art so if there's any adjustments you'd like to change just gladly tell me. Though if the pose is approved on the sketch process there will be a fee if you suddenly change your mind.",
    ],
    // TODO(kurai): your actual tools — delete any you do not use.
    toolkit: ['Krita', 'Aseprite'],
    // TODO(kurai): delete this block entirely if you would rather not list one.
    services: ['Rendered illustrations', 'Pixel art', 'Sketching', 'Chibis'],
    servicesHeading: 'Services',
    toolkitHeading: 'Toolkit',
  },
  contact: {
    title: 'Contact',
    /* Small label above the headline, matching the About page's pattern. */
    eyebrow: 'Contact',
    heading: "Let's Create Something",
    // TODO(kurai): adjust if your turnaround expectation differs.
    intro:
      'Whether you are interested in a commission, a collaboration, or simply want to say hello — the fastest way to reach me is through the links below.',
    commissionsHeading: 'Commissions',
    commissionsBody:
      'Slots, pricing, and terms of service live on VGen.',
    elsewhereHeading: 'Elsewhere',
    directHeading: 'Direct inquiries',
    /**
     * Stands in for the address until the visitor hovers, focuses or taps it —
     * the address is not in the page until then. See `EmailLink`.
     */
    emailPlaceholder: 'Reveal email address',
  },
  notFound: {
    title: 'Not found',
    heading: 'Nothing here.',
    body: 'That page does not exist — it may have been renamed or removed.',
    cta: 'Back to home',
  },
} as const

/** Home-page section copy. */
export const home = {
  marquee: {
    eyebrow: 'Portfolio',
    heading: 'Works',
    cta: 'See all',
  },
  aboutTeaser: {
    eyebrow: 'About',
    cta: 'More about me',
  },
  contactTeaser: {
    eyebrow: 'Contact',
    heading: "Bring Your Characters to Life",
    cta: 'Get in touch',
  },
} as const

/** Lightbox chrome. Kept here so it is translatable with everything else. */
export const viewer = {
  label: 'Artwork viewer',
  close: 'Close viewer',
  next: 'Next piece',
  previous: 'Previous piece',
  railLabel: 'Choose a piece',
  variantsLabel: 'Artwork variants',
} as const
