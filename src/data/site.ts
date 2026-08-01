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
  role: 'Portfolio',
  // TODO(kurai): ~150 characters, used for search results and link previews.
  description:
    'Portfolio of Hellane Kurai — Commission information and Socials.',
  /** Set once the domain is live; used for canonical and share URLs. */
  url: '',
  // TODO(kurai): public contact address, or leave null to hide it entirely.
  email: null as string | null,
  // TODO(kurai): 'Open' | 'Waitlist' | 'Closed' — drives the status pill.
  commissionStatus: 'Open' as CommissionStatus,
  copyrightStartYear: 2024,
} as const

export type CommissionStatus = 'Open' | 'Waitlist' | 'Closed'

export const nav: readonly NavItem[] = [
  { label: 'Works', to: '/works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/** Home hero — the mockup's "Featured Character" card, with Kurai as subject. */
export const hero = {
  eyebrow: 'Illustrator & Character Designer',
  name: 'Hellane Kurai',
  backgroundAlt:
    'Illustrated self-portrait of Hellane Kurai: long purple hair, round glasses, green top, holding a stylus, against a pink and sky-blue polka-dot background.',
  /** Two framings of the same person, carried over from the mockup's tabs. */
  tabs: [
    {
      id: 'about',
      label: 'About',
      // TODO(kurai): 2–3 sentences. Who you are and what you draw.
      body: 'Character-focused illustrator working in a bright, expressive anime style — original characters, commissioned portraits, and reference sheets.',
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
    // TODO(kurai): one sentence introducing the gallery.
    intro: 'Character designs, commissions, and personal work.',
    emptyMessage: 'Nothing published yet.',
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
      'Replace this paragraph with how you got started and what you like drawing most.',
      'Replace this paragraph with the kind of work you take on, and anything a prospective client should know before reaching out.',
    ],
    // TODO(kurai): your actual tools — delete any you do not use.
    toolkit: ['Krita', 'Aseprite'],
    // TODO(kurai): delete this block entirely if you would rather not list one.
    focus: ['Character design', 'Portrait commissions', 'Reference sheets', 'Emotes'],
    focusHeading: 'What I take on',
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
