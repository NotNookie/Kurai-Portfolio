import { useEffect, useState } from 'react'

/**
 * `false` on the first render, `true` from the next animation frame onward.
 *
 * Exists to fix scroll-reveal animations firing all at once. framer-motion sets
 * its IntersectionObserver up on mount, and for a lazily-loaded route the
 * observation can land before the browser has laid the subtree out — every
 * element then reports as intersecting, and `once: true` freezes that wrong
 * answer, so the whole grid reveals immediately instead of on scroll.
 *
 * Waiting a frame guarantees layout has happened before anything is observed.
 * Verified against the same element: a raw IntersectionObserver created after
 * settle correctly reports it as out of view, while framer's mount-time one
 * did not.
 */
export function useAfterPaint(): boolean {
  const [painted, setPainted] = useState(false)

  useEffect(() => {
    // setState lives in the rAF callback, not the effect body — the same
    // pattern used for the marquee's ResizeObserver.
    const id = requestAnimationFrame(() => setPainted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return painted
}
