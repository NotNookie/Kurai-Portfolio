import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { hero } from '@/data/site'
import { Button, Container, Tabs } from '@/components/ui'
import { Blob, DotField } from '@/components/ui/Ornament/Ornament'
import coverImage from '@/assets/kuraiCover.png'
import styles from './Hero.module.css'

/**
 * Home hero — the mockup's "Featured Character" card, with Kurai as the subject.
 *
 * Her vgen cover already has her name and handles painted into its left third,
 * so the content card is deliberately anchored left to sit over that area. The
 * illustrated portrait occupies the right and stays uncovered; `object-position`
 * keeps her in frame as the viewport narrows.
 */
export function Hero() {
  const [activeTab, setActiveTab] = useState<string>(hero.tabs[0].id)
  const reduceMotion = useReducedMotion()
  const idBase = useId()

  const panel = hero.tabs.find((tab) => tab.id === activeTab) ?? hero.tabs[0]

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.6,
      delay: reduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  })

  return (
    <section className={styles.hero} aria-labelledby={`${idBase}-name`}>
      <Blob tone="cyan" placement="bottom-left" scale={1.3} />

      <div className={styles.frame}>
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
          <motion.div className={styles.card} {...rise(0.05)}>
            <DotField gap={16} />

            <p className={styles.eyebrow}>{hero.eyebrow}</p>

            <h1 id={`${idBase}-name`} className={styles.name}>
              {hero.name}
            </h1>

            <Tabs
              items={hero.tabs.map(({ id, label }) => ({ id, label }))}
              value={activeTab}
              onChange={setActiveTab}
              label="About Hellane Kurai"
              idBase={idBase}
              appearance="pill"
              className={styles.tabs}
            />

            <div
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
            </div>

            <div className={styles.actions}>
              <Button to={hero.primaryCta.to} variant="solid" withArrow>
                {hero.primaryCta.label}
              </Button>
              <Button to={hero.secondaryCta.to} variant="outline">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
