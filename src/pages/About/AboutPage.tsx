import { motion, useReducedMotion } from 'framer-motion'
import { pages, site } from '@/data/site'
import { primarySocial } from '@/data/socials'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Container } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import portraitImage from '@/assets/kuraiPfp.png'
import styles from './AboutPage.module.css'

/**
 * About.
 *
 * The lede carries the page rather than a generic "About" heading, and the bio
 * sits in a speech bubble echoing the lettering bubbles painted into Kurai's
 * own cover art.
 *
 * Everything is set straight. An earlier version tilted the blocks like
 * scrapbook stickers and scattered artwork thumbnails through the layout; both
 * read as off rather than playful, so the composition now relies on the bubble
 * shape and the ornaments alone.
 */
export function AboutPage() {
  useDocumentTitle(pages.about.title)
  const reduceMotion = useReducedMotion()

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.55,
      delay: reduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  })

  return (
    <div className={styles.page}>
      <Blob tone="cyan" placement="top-right" scale={1.5} />
      <Blob tone="pink" placement="bottom-left" scale={1.3} />

      <Container>
        <motion.header className={styles.intro} {...rise(0)}>
          {/* The label steps back so the lede can be the page's voice. */}
          <p className={styles.eyebrow}>{pages.about.heading}</p>
          <h1 className={styles.lede}>{pages.about.lede}</h1>
        </motion.header>

        <div className={styles.layout}>
          <motion.figure className={styles.portrait} {...rise(0.06)}>
            <div className={styles.portraitCard}>
              <img
                src={portraitImage}
                alt={`Chibi avatar of ${site.name}.`}
                className={styles.portraitImage}
                loading="eager"
                decoding="async"
              />
            </div>
            {/* The figure already carries the image; the caption names her. */}
            <figcaption className={styles.portraitName}>{site.name}</figcaption>
          </motion.figure>

          <motion.div className={styles.bubble} {...rise(0.12)}>
            {pages.about.body.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div className={styles.statusCard} {...rise(0.18)}>
            <p className={styles.statusLabel}>Commissions</p>
            <p className={styles.statusValue}>
              <span
                className={styles.statusDot}
                data-status={site.commissionStatus}
                aria-hidden="true"
              />
              {site.commissionStatus}
            </p>
            <Button href={primarySocial.href} variant="solid" withArrow className={styles.cta}>
              Commission on {primarySocial.label}
            </Button>
          </motion.div>

          <motion.section className={styles.focus} aria-labelledby="about-services" {...rise(0.24)}>
            <h2 id="about-services" className={styles.focusHeading}>
              {pages.about.servicesHeading}
            </h2>
            <ul className={styles.chips} role="list">
              {pages.about.services.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </Container>
    </div>
  )
}

export default AboutPage
