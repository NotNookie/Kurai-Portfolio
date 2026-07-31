import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` rather than useEffect + useState so the first render
 * already has the correct value — no flash of the wrong layout on mount.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = (onChange: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Server/prerender fallback: assume desktop.
    () => false,
  )
}

/** Matches the `--header-h` breakpoint used across the layout CSS. */
export const useIsMobileNav = () => useMediaQuery('(max-width: 55rem)')
