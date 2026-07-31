import { motion, useReducedMotion } from 'framer-motion'
import { pages, site } from '@/data/site'
import { primarySocial } from '@/data/socials'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Container } from '@/components/ui'
import { Blob, DotField } from '@/components/ui/Ornament/Ornament'
import portraitImage from '@/assets/kuraiPfp.png'
import styles from './AboutPage.module.css'

export function AboutPage() {
  useDocumentTitle(pages.about.title)
  const reduceMotion = useReducedMotion()

  return (
    <div className={styles.page}>
      <Blob tone="pink" placement="top-right" scale={1.4} />
      <Blob tone="cyan" placement="bottom-left" scale={1.1} />

      <Container>
        <h1 className={styles.pageHeading}>{pages.about.heading}</h1>

        <div className={styles.layout}>
          <motion.div
            className={styles.aside}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.portraitFrame}>
              <img
                src={portraitImage}
                alt={`Chibi avatar of ${site.name}.`}
                className={styles.portrait}
                loading="eager"
                decoding="async"
              />
              <DotField gap={16} />
            </div>

            <dl className={styles.factList}>
              <div className={styles.factRow}>
                <dt className={styles.factLabel}>Role</dt>
                <dd className={styles.factValue}>{site.role}</dd>
              </div>
              <div className={styles.factRow}>
                <dt className={styles.factLabel}>Commissions</dt>
                <dd className={styles.factValue}>
                  <span
                    className={styles.statusDot}
                    data-status={site.commissionStatus}
                    aria-hidden="true"
                  />
                  {site.commissionStatus}
                </dd>
              </div>
            </dl>

            <Button href={primarySocial.href} variant="solid" withArrow className={styles.asideCta}>
              Commission on {primarySocial.label}
            </Button>
          </motion.div>

          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.lede}>{pages.about.lede}</p>

            {pages.about.body.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}

            <div className={styles.lists}>
              <section aria-labelledby="about-focus">
                <h2 id="about-focus" className={styles.listHeading}>
                  {pages.about.focusHeading}
                </h2>
                <ul className={styles.chips} role="list">
                  {pages.about.focus.map((item) => (
                    <li key={item} className={styles.chipPink}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="about-toolkit">
                <h2 id="about-toolkit" className={styles.listHeading}>
                  {pages.about.toolkitHeading}
                </h2>
                <ul className={styles.chips} role="list">
                  {pages.about.toolkit.map((item) => (
                    <li key={item} className={styles.chipCyan}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}

export default AboutPage
