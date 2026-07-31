import { useEffect, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import styles from './RootLayout.module.css'

/**
 * Application shell: skip link, header, animated route outlet, footer.
 *
 * `useOutlet` rather than `<Outlet />` so the rendered route element can be
 * keyed by pathname — that is what lets AnimatePresence run an exit animation
 * before the next page mounts.
 */
export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduceMotion = useReducedMotion()
  const [announcement, setAnnouncement] = useState('')
  const isFirstRender = useRef(true)

  /**
   * Route changes are silent to screen readers in an SPA — nothing reloads, so
   * nothing is announced. Push the new document title into a live region.
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timer = window.setTimeout(() => setAnnouncement(`${document.title} — page loaded`), 120)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>

      <Header />

      <AnimatePresence
        mode="wait"
        initial={false}
        // Scroll only when the path changes, not when a query param does —
        // otherwise opening the lightbox or switching a filter yanks the
        // gallery back to the top.
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        <motion.main
          key={location.pathname}
          id="main"
          className={styles.main}
          tabIndex={-1}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={transition}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <Footer />

      <div role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </div>
    </>
  )
}
