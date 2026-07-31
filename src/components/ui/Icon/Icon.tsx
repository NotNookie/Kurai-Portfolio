import type { SVGProps } from 'react'
import type { IconName } from '@/types/content'

/**
 * Inline SVG icon registry.
 *
 * Inline rather than an icon font or sprite sheet so icons inherit
 * `currentColor` (and therefore theme correctly), carry no extra network
 * request, and can never render as tofu while a font loads.
 */

type IconDefinition = {
  viewBox: string
  /** `fill` for brand glyphs, `stroke` for the geometric UI icons. */
  mode: 'fill' | 'stroke'
  paths: readonly string[]
  /** Extra non-path children, e.g. circles. */
  circles?: readonly { cx: number; cy: number; r: number; filled?: boolean }[]
}

const ICONS: Record<IconName, IconDefinition> = {
  x: {
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: [
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z',
    ],
  },
  instagram: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M2.75 7.5A4.75 4.75 0 0 1 7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9Z'],
    circles: [
      { cx: 12, cy: 12, r: 4 },
      { cx: 17.4, cy: 6.6, r: 1.1, filled: true },
    ],
  },
  twitch: {
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: [
      'M2.149 0 .537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657L23.462 14.5V0H2.149Zm19.164 13.612-3.582 3.582h-5.731l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463Z',
      'M17.731 5.731v6.628h-2.149V5.731h2.149Zm-5.731 0v6.628H9.851V5.731H12Z',
    ],
  },
  bluesky: {
    viewBox: '0 0 568 501',
    mode: 'fill',
    paths: [
      'M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.209C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.07-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.66 0 75.293 0 57.947 0-28.906 76.135-1.611 123.121 33.664Z',
    ],
  },
  vgen: {
    // No official mark is published as an open asset, so this is a neutral
    // geometric stand-in rather than an imitation of their branding.
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M3.75 3.75h16.5v16.5H3.75z', 'm8 8.75 4 7.25 4-7.25'],
  },
  mail: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M2.75 6.75h18.5v10.5H2.75z', 'm3.5 7.5 8.5 6 8.5-6'],
  },
  'arrow-right': {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M4 12h16', 'm14 6 6 6-6 6'],
  },
  'arrow-left': {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M20 12H4', 'm10 6-6 6 6 6'],
  },
  close: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['m5.5 5.5 13 13', 'm18.5 5.5-13 13'],
  },
  menu: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M3.5 7h17', 'M3.5 12h17', 'M3.5 17h17'],
  },
  expand: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M4 9V4.5h4.5', 'm4.5 4.5 5 5', 'M20 15v4.5h-4.5', 'm19.5 19.5-5-5'],
  },
  external: {
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M13.5 4.5H19.5V10.5', 'm19 5-8 8', 'M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4'],
  },
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Rendered size in px, applied to both axes. */
  size?: number
  /**
   * Accessible label. Omit for icons that sit next to visible text — the
   * default is `aria-hidden`, which is correct for decorative duplication.
   */
  title?: string
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  const icon = ICONS[name]

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill={icon.mode === 'fill' ? 'currentColor' : 'none'}
      stroke={icon.mode === 'stroke' ? 'currentColor' : 'none'}
      strokeWidth={icon.mode === 'stroke' ? 1.6 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {icon.paths.map((d) => (
        <path key={d} d={d} />
      ))}
      {icon.circles?.map((circle) => (
        <circle
          key={`${circle.cx}-${circle.cy}-${circle.r}`}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.filled ? 'currentColor' : 'none'}
          stroke={circle.filled ? 'none' : 'currentColor'}
        />
      ))}
    </svg>
  )
}
