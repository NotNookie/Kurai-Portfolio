import { useEffect } from 'react'

/**
 * Freezes background scrolling while an overlay is open.
 *
 * Compensates for the removed scrollbar with padding so the page does not shift
 * sideways when the menu opens.
 */
export const useScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}
