import { motion, useReducedMotion } from 'framer-motion'
import { home, pages } from '@/data/site'
import { Button, Container } from '@/components/ui'
import { Blob, DotField } from '@/components/ui/Ornament/Ornament'
import avatarImage from '@/assets/drawing.png'
import styles from './AboutTeaser.module.css'

export function AboutTeaser() {
  const reduceMotion = useReducedMotion()

  return (
    <section className={styles.section} aria-labelledby="about-teaser">
      <Blob tone="mixed" placement="center-right" scale={1.3} />

      <Container className={styles.inner}>
        <motion.div
          className={styles.media}
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={avatarImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={styles.avatar}
          />
          <DotField gap={16} />
        </motion.div>

        <motion.div
          className={styles.body}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.eyebrow}>{home.aboutTeaser.eyebrow}</p>
          <h2 id="about-teaser" className={styles.heading}>
            {pages.about.lede}
          </h2>

          <ul className={styles.chips} role="list">
            {pages.about.focus.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
          </ul>

          <Button to="/about" variant="outline" withArrow>
            {home.aboutTeaser.cta}
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
