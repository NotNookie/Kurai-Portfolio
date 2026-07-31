import { pages } from '@/data/site'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Container } from '@/components/ui'
import { Blob } from '@/components/ui/Ornament/Ornament'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  useDocumentTitle(pages.notFound.title)

  return (
    <Container width="narrow" className={styles.page}>
      <Blob tone="mixed" placement="center-right" scale={1.2} />
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.heading}>{pages.notFound.heading}</h1>
      <p className={styles.body}>{pages.notFound.body}</p>
      <div className={styles.actions}>
        <Button to="/" variant="solid" withArrow>
          {pages.notFound.cta}
        </Button>
        <Button to="/works" variant="outline">
          Browse works
        </Button>
      </div>
    </Container>
  )
}

export default NotFoundPage
