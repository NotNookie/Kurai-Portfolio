import type { Transition, Variants } from 'framer-motion'

/**
 * Shared motion vocabulary.
 *
 * Timing and easing live here rather than being retyped per component, so the
 * whole site moves with one personality: springy, with a small overshoot, to
 * match the rounded pills and blobs in the visual language.
 *
 * Every export takes `reduce` — the value of `useReducedMotion()`. Under
 * reduced motion the springs collapse to zero-duration and all travel is
 * removed, so elements appear in place rather than sliding or bouncing. That
 * matters more here than usual: framer-motion drives these with JS, so the
 * global `prefers-reduced-motion` rule in global.css does NOT cover them.
 */

/** The house spring. Overshoots slightly, then settles. */
export const SPRING: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 22,
  mass: 0.9,
}

/** Calmer spring for larger elements, where a bounce would read as wobble. */
export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 190,
  damping: 26,
  mass: 1,
}

/** Non-spring easing, for opacity-only work where a spring is pointless. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const transition = (reduce: boolean, base: Transition = SPRING): Transition =>
  reduce ? { duration: 0 } : base

/**
 * Scroll-reveal viewport config. `once` so a section does not re-animate every
 * time it passes the fold — replaying on every scroll is the fastest way to
 * make motion feel cheap. The negative margin starts the reveal slightly before
 * the element is fully visible, so it is already settling as it arrives.
 */
export const VIEWPORT = { once: true, margin: '-10% 0px -10% 0px' } as const

/**
 * Standard rise-and-fade for a block entering view.
 *
 * Under reduced motion the hidden state is fully opaque, not just untranslated.
 * Fading in on scroll is still a staged appearance, and it would leave content
 * below the fold invisible until the visitor reaches it — for these users the
 * content should simply be present, exactly as the marquee simply stops.
 */
export const fadeUp = (reduce: boolean, distance = 24): Variants => ({
  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(reduce, SPRING_SOFT),
  },
})

/**
 * Parent that releases its children in sequence. Pair with `staggerChild`.
 * `delayChildren` lets a container settle before its contents start.
 */
export const staggerParent = (
  reduce: boolean,
  stagger = 0.07,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: reduce
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: stagger, delayChildren },
  },
})

/** Child of `staggerParent`. See `fadeUp` on the reduced-motion hidden state. */
export const staggerChild = (reduce: boolean, distance = 18): Variants => ({
  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(reduce, SPRING),
  },
})

/**
 * Grid-tile reveal. Capped delay so a large gallery does not leave the last
 * tile waiting seconds — with 20+ pieces an uncapped index delay is unusable.
 */
export const tileReveal = (reduce: boolean, index: number): Transition =>
  reduce
    ? { duration: 0 }
    : { ...SPRING, delay: Math.min(index * 0.05, 0.35) }
