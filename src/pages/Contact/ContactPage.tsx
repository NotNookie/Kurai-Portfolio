import { motion, useReducedMotion } from 'framer-motion'
import { pages, site } from '@/data/site'
import { primarySocial, socialsFor } from '@/data/socials'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Container, Icon, RevealText } from '@/components/ui'
import { Blob, DotField } from '@/components/ui/Ornament/Ornament'
import styles from './ContactPage.module.css'

/**
 * Contact — links only, no form.
 *
 * Commissions route to VGen, which is where slots, pricing, and terms actually
 * live; duplicating them here would guarantee they go stale.
 *
 * Hierarchy is the point of this layout. An earlier version made every surface
 * bare, which read as flat: the commission call to action looked exactly like
 * the list of social links beside it. Now exactly one element is a filled panel
 * — the thing the page exists for — and everything else stays bare.
 */
export function ContactPage() {
  useDocumentTitle(pages.contact.title)
  const reduceMotion = useReducedMotion()

  const elsewhere = socialsFor('contact').filter((social) => !social.primary)

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.55,
      delay: reduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  })

  return (
    <div className={styles.page}>
      <DotField gap={24} />
      <Blob tone="pink" placement="top-right" scale={1.3} />
      <Blob tone="cyan" placement="bottom-left" scale={1.1} />

      <Container className={styles.layout}>
        <motion.div className={styles.intro} {...fade(0)}>
          {/* Mirrors the About page: small label, statement as the heading. */}
          <p className={styles.eyebrow}>{pages.contact.eyebrow}</p>
          <RevealText as="h1" className={styles.heading} trigger="mount" stagger={0.05} delay={0.1}>
            {pages.contact.heading}
          </RevealText>
          <p className={styles.introText}>{pages.contact.intro}</p>

          {site.email ? (
            <div className={styles.direct}>
              <h2 className={styles.blockLabel}>{pages.contact.directHeading}</h2>
              <a href={`mailto:${site.email}`} className={styles.email}>
                {site.email}
              </a>
            </div>
          ) : null}
        </motion.div>

        <motion.div className={styles.panels} {...fade(0.1)}>
          {/* The one filled surface on the page. */}
          <section className={styles.commissionPanel} aria-labelledby="contact-commissions">
            <div className={styles.panelHead}>
              <h2 id="contact-commissions" className={styles.panelLabel}>
                {pages.contact.commissionsHeading}
              </h2>
              <p className={styles.status}>
                <span
                  className={styles.statusDot}
                  data-status={site.commissionStatus}
                  aria-hidden="true"
                />
                {site.commissionStatus}
              </p>
            </div>

            <p className={styles.panelBody}>{pages.contact.commissionsBody}</p>

            <Button href={primarySocial.href} variant="solid" size="lg" withArrow>
              Commission on {primarySocial.label}
            </Button>
          </section>

          <section aria-labelledby="contact-elsewhere">
            <h2 id="contact-elsewhere" className={styles.blockLabel}>
              {pages.contact.elsewhereHeading}
            </h2>
            <ul className={styles.socialList} role="list">
              {elsewhere.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <span className={styles.socialIcon}>
                      <Icon name={social.icon} size={18} />
                    </span>
                    <span className={styles.socialText}>
                      <span className={styles.socialLabel}>
                        {social.label}
                        {social.handle ? (
                          <span className={styles.socialHandle}> {social.handle}</span>
                        ) : null}
                      </span>
                      {social.note ? <span className={styles.socialNote}>{social.note}</span> : null}
                    </span>
                    <Icon name="external" size={15} className={styles.socialExternal} />
                    <span className="visually-hidden">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </motion.div>
      </Container>
    </div>
  )
}

export default ContactPage
