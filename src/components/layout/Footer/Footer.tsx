import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { socialsFor } from '@/data/socials'
import { Container, Icon } from '@/components/ui'
import avatarImage from '@/assets/kuraiPfp.png'
import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const yearLabel =
    currentYear > site.copyrightStartYear
      ? `${site.copyrightStartYear}–${currentYear}`
      : `${site.copyrightStartYear}`

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <Link to="/" className={styles.wordmark}>
          <img src={avatarImage} alt="" aria-hidden="true" className={styles.avatar} />
          {site.name}
        </Link>

        <p className={styles.copyright}>
          © {yearLabel} {site.name}. All rights reserved.
        </p>

        <ul className={styles.socials} role="list">
          {socialsFor('footer').map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Icon name={social.icon} size={15} />
                <span>{social.label}</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  )
}
