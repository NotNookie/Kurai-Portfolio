import type { SocialLink } from '@/types/content'

/**
 * Every outbound link on the site, in one place.
 *
 * `placements` controls where each link appears, so adding a platform is a
 * one-line change here rather than an edit in three components.
 */
export const socials: readonly SocialLink[] = [
  {
    id: 'vgen',
    label: 'VGen',
    handle: '@Hellane_Kurai',
    href: 'https://vgen.co/Hellane_Kurai',
    icon: 'vgen',
    placements: ['footer', 'contact'],
    primary: true,
    note: 'Commission slots, current pricing, and terms of service.',
  },
  {
    id: 'x',
    label: 'X',
    handle: '@KekManeuver',
    href: 'https://x.com/KekManeuver',
    icon: 'x',
    placements: ['header', 'footer', 'contact'],
    note: 'Work in progress shots and slot announcements.',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@hellanenoobart_307',
    href: 'https://www.instagram.com/hellanenoobart_307/',
    icon: 'instagram',
    placements: ['header', 'footer', 'contact'],
    note: 'Finished pieces and process reels.',
  },
  {
    id: 'twitch',
    label: 'Twitch',
    handle: '@hellane_kurai',
    href: 'https://www.twitch.tv/hellane_kurai',
    icon: 'twitch',
    placements: ['header', 'footer', 'contact'],
    note: 'Live drawing streams.',
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    handle: '@hellane.bsky.social',
    href: 'https://bsky.app/profile/hellane.bsky.social',
    icon: 'bluesky',
    placements: ['footer', 'contact'],
    note: 'Cross-posted artwork.',
  },
]

export const socialsFor = (placement: SocialLink['placements'][number]) =>
  socials.filter((link) => link.placements.includes(placement))

/** The single commission call to action, reused across pages. */
export const primarySocial = socials.find((link) => link.primary) ?? socials[0]!
