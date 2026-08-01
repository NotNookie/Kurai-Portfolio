import { motion, useReducedMotion } from 'framer-motion'
import { home } from '@/data/site'
import { primarySocial, socialsFor } from '@/data/socials'
import { Button, Container, Icon } from '@/components/ui'
import { Blob, DotField } from '@/components/ui/Ornament/Ornament'
import styles from './ContactCta.module.css'

/** Closing call to action. Commissions route to VGen; everything else is a link. */
export function ContactCta() {
  const reduceMotion = useReducedMotion()

  return (
    <section className={styles.section} aria-labelledby="contact-cta">
      {/* Ornaments sit on the section, not inside the container, so the dot
          field covers the full width and height of the section rather than
          being boxed in by the container's max-width and gutters. */}
      <DotField gap={22} />
      <Blob tone="pink" placement="top-left" scale={1.1} />
      <Blob tone="cyan" placement="bottom-right" scale={1.1} />

      <Container>
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{home.contactTeaser.eyebrow}</p>
            <h2 id="contact-cta" className={styles.heading}>
              {home.contactTeaser.heading}
            </h2>

            <div className={styles.actions}>
              <Button href={primarySocial.href} variant="solid" size="lg" withArrow>
                Commission on {primarySocial.label}
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                {home.contactTeaser.cta}
              </Button>
            </div>

            <ul className={styles.socials} role="list">
              {socialsFor('footer')
                .filter((social) => !social.primary)
                .map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <Icon name={social.icon} size={16} />
                      <span>{social.handle ?? social.label}</span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
