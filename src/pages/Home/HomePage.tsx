import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Hero } from '@/components/sections/Hero/Hero'
import { ArtMarquee } from '@/components/sections/ArtMarquee/ArtMarquee'
import { AboutTeaser } from '@/components/sections/AboutTeaser/AboutTeaser'
import { ContactCta } from '@/components/sections/ContactCta/ContactCta'

/** Long-scroll landing page: hero → artwork marquee → about → contact. */
export function HomePage() {
  useDocumentTitle()

  return (
    <>
      <Hero />
      <ArtMarquee />
      <AboutTeaser />
      <ContactCta />
    </>
  )
}

export default HomePage
