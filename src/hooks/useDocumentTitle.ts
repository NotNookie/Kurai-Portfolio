import { useEffect } from 'react'
import { site } from '@/data/site'

/**
 * Sets `document.title` for the current route.
 *
 * A client-rendered SPA has one static <title> in the HTML, so without this
 * every page shares the home page's title — bad for tab switching, browser
 * history, and bookmarks.
 */
export const useDocumentTitle = (title?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`
  }, [title])
}
