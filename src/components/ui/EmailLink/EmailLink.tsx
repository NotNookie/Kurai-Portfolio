import { useState } from 'react'
import { pages } from '@/data/site'
import { getEmail, getMailtoHref } from '@/lib/email'
import styles from './EmailLink.module.css'

interface EmailLinkProps {
  className?: string
}

/**
 * The contact address, kept out of the document until a person reaches for it.
 *
 * Splitting the address in the data layer (see `lib/email.ts`) defeats crawlers
 * that regex over fetched text, but not one that runs the page and reads the
 * rendered DOM. So the address is not in the DOM at all until a real
 * interaction — hover, keyboard focus, or touch — puts it there.
 *
 * It is a <button>, not an <a>, and that is deliberate. An anchor without an
 * href is not focusable and not a link, so a keyboard user could never reach it
 * to trigger the reveal; the address would be permanently unreachable for them.
 * A button is focusable from the start, so tabbing to it reveals the address and
 * Enter opens the mail client. Activation navigates to the `mailto:` rather than
 * following an href.
 *
 * The cost is that right-click "copy link address" and open-in-new-tab are gone.
 * The address is ordinary selectable text once revealed, so it can still be
 * copied by hand, and a `mailto:` was never useful in a new tab.
 *
 * What this cannot stop is a crawler that drives a real browser and dispatches
 * focus or pointer events. Nothing client-side can: any reveal a person can
 * trigger, a script can trigger too. It raises the cost from "fetch and regex"
 * to "drive a browser per page", which is the whole of what is achievable here.
 */
export function EmailLink({ className }: EmailLinkProps) {
  const [revealed, setRevealed] = useState(false)

  const address = revealed ? getEmail() : null
  const reveal = () => setRevealed(true)

  return (
    <button
      type="button"
      className={[styles.email, className].filter(Boolean).join(' ')}
      /*
       * Every route in: pointer for mouse, focus for keyboard, touchStart so a
       * tap reveals before the click lands rather than needing a second tap.
       */
      onPointerEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      onClick={() => {
        // Read through the assembler rather than state, so the very first tap
        // works even if the reveal render has not committed yet.
        const href = getMailtoHref()
        if (href) window.location.href = href
      }}
      // Before the reveal the visible text is a prompt, so the button needs to
      // say what it does. Afterwards the address is its own label.
      aria-label={revealed ? undefined : pages.contact.emailPlaceholder}
    >
      {address ?? pages.contact.emailPlaceholder}
    </button>
  )
}
