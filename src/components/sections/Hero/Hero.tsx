import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { hero } from '@/data/site'
import { staggerChild, staggerParent } from '@/lib/motion'
import { Button, Container, RevealText, Tabs } from '@/components/ui'
import coverImage from '@/assets/kuraiCover.webp'
import styles from './Hero.module.css'

/**
 * Home hero.
 *
 * Her cover art fills the whole section — edge to edge, no frame and no card —
 * with the copy set directly on top of it.
 *
 * Two constraints drive the crop, both handled in CSS:
 *   1. The artwork has her name and social handles painted into its left third.
 *      The image is zoomed and anchored right so that region falls outside the
 *      frame entirely, rather than duplicating the heading below it.
 *   2. Plum text over her bright pink shapes would drop below 4.5:1, so a soft
 *      cream scrim sits under the copy.
 */
export function Hero() {
  const [activeTab, setActiveTab] = useState<string>(hero.tabs[0].id)
  const reduceMotion = useReducedMotion()
  const idBase = useId()

  const panel = hero.tabs.find((tab) => tab.id === activeTab) ?? hero.tabs[0]

  /**
   * The copy cascades in rather than arriving as one block: the name lands
   * first and the rest of the page assembles around it. `delayChildren` holds
   * everything back a beat so the artwork behind has painted first.
   */
  const parent = staggerParent(reduceMotion ?? false, 0.08, 0.15)
  const child = staggerChild(reduceMotion ?? false)

  return (
    <section className={styles.hero} aria-labelledby={`${idBase}-name`}>
      <div className={styles.backdrop}>
        <img
          src={coverImage}
          alt={hero.backgroundAlt}
          className={styles.backdropImage}
          fetchPriority="high"
          decoding="sync"
        />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <Container className={styles.container}>
        <motion.div
          className={styles.copy}
          variants={parent}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={styles.eyebrow} variants={child}>
            {hero.eyebrow}
          </motion.p>

          <RevealText
            as="h1"
            id={`${idBase}-name`}
            className={styles.name}
            trigger="mount"
            stagger={0.07}
            delay={0.25}
          >
            {hero.name}
          </RevealText>

          <motion.div variants={child}>
            <Tabs
              items={hero.tabs.map(({ id, label }) => ({ id, label }))}
              value={activeTab}
              onChange={setActiveTab}
              label="About Hellane Kurai"
              idBase={idBase}
              appearance="pill"
              className={styles.tabs}
            />
          </motion.div>

          <motion.div
            variants={child}
            id={`${idBase}-panel`}
            role="tabpanel"
            aria-labelledby={`${idBase}-tab-${panel.id}`}
            tabIndex={0}
            className={styles.panel}
          >
            {/* Keyed so the paragraph re-animates when the tab changes. */}
            <motion.p
              key={panel.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.panelText}
            >
              {panel.body}
            </motion.p>
          </motion.div>

          <motion.div className={styles.actions} variants={child}>
            <Button to={hero.primaryCta.to} variant="solid" withArrow>
              {hero.primaryCta.label}
            </Button>
            <Button to={hero.secondaryCta.to} variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
