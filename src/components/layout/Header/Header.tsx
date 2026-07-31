import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, site } from '@/data/site'
import { socialsFor } from '@/data/socials'
import { useIsMobileNav } from '@/hooks/useMediaQuery'
import { useScrollLock } from '@/hooks/useScrollLock'
import { Icon } from '@/components/ui'
import avatarImage from '@/assets/kuraiPfp.png'
import styles from './Header.module.css'

export function Header() {
  const [menuRequested, setMenuRequested] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobileNav = useIsMobileNav()
  const location = useLocation()
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  /** Derived, so growing past the mobile breakpoint closes the overlay free. */
  const menuOpen = menuRequested && isMobileNav

  /**
   * Close on navigation. Adjusting state during render is React's documented
   * pattern for this; an effect would show the stale open menu for a frame.
   */
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuRequested(false)
  }

  useScrollLock(menuOpen)

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuRequested(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={styles.header} data-scrolled={scrolled} data-open={menuOpen}>
      <div className={styles.inner}>
        <Link to="/" className={styles.wordmark}>
          {/* Her chibi as the mark, in the spirit of the reference site's
              floating character avatar in the nav. */}
          <img src={avatarImage} alt="" aria-hidden="true" className={styles.avatar} />
          <span className={styles.wordmarkText}>{site.name}</span>
          <span className={styles.wordmarkShort} aria-hidden="true">
            {site.shortName}
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList} role="list">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ul className={styles.socialList} role="list">
            {socialsFor('header').map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Icon
                    name={social.icon}
                    size={16}
                    title={`${social.label} (opens in a new tab)`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuRequested((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Kept mounted so the close transition can play. `inert` (not `hidden`,
          which would kill the transition) removes it from the tab order and the
          accessibility tree while closed. */}
      <div id={menuId} className={styles.mobilePanel} data-open={menuOpen} inert={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className={styles.mobileList} role="list">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [styles.mobileLink, isActive ? styles.mobileLinkActive : '']
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.mobileSocials} role="list">
          {socialsFor('footer').map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileSocialLink}
              >
                <Icon name={social.icon} size={16} />
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
