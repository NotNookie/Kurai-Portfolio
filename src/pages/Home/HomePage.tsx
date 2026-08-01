import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Hero } from '@/components/sections/Hero/Hero'
import { ArtMarquee } from '@/components/sections/ArtMarquee/ArtMarquee'
import { ContactCta } from '@/components/sections/ContactCta/ContactCta'

/**
 * Landing page: hero → scrolling artwork rows → contact.
 *
 * There is no About section here by design; the bio lives on `/about` and the
 * home page stays focused on artwork.
 */
export function HomePage() {
  useDocumentTitle()

  return (
    <>
      <Hero />
      <ArtMarquee rows={3} />
      <ContactCta />
    </>
  )
}

export default HomePage
