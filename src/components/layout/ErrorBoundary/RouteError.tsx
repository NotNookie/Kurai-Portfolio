import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button, Container } from '@/components/ui'
import styles from './RouteError.module.css'

/**
 * Router-level error element.
 *
 * Catches thrown responses (404s from loaders) and render-time crashes so a
 * single broken data entry degrades to a readable page instead of a blank
 * white screen.
 */
export function RouteError() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : null
  const heading = status === 404 ? 'Nothing here.' : 'Something went wrong.'
  const message =
    status === 404
      ? 'That page does not exist — it may have been renamed or removed.'
      : 'An unexpected error stopped this page from loading.'

  return (
    <Container className={styles.root} width="narrow">
      {status ? <p className={styles.status}>{status}</p> : null}
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.message}>{message}</p>

      {/* Detail is useful in development and noise in production. */}
      {import.meta.env.DEV && error instanceof Error ? (
        <pre className={styles.detail}>{error.stack ?? error.message}</pre>
      ) : null}

      <Button to="/" variant="solid" withArrow>
        Back to home
      </Button>
    </Container>
  )
}
