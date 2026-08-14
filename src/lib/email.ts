import { site } from '@/data/site'

/**
 * The contact address, assembled at runtime.
 *
 * `site.email` keeps the two halves apart so that no complete address exists in
 * the repo or in the shipped bundle. Address-harvesting crawlers overwhelmingly
 * work by running a regex over fetched text, and there is nothing here for one
 * to match.
 *
 * The join must stay a runtime operation. Bundlers constant-fold literal string
 * concatenation — `'a' + '@' + 'b'` really does become `'a@b'` in the output —
 * which would undo the whole thing silently. `Array.join` is a method call and
 * is not folded, so it survives minification. `npm run check:email` asserts
 * exactly that against the built files.
 *
 * That alone would not stop a crawler that runs the page and reads the rendered
 * DOM, so `EmailLink` keeps the address out of the document until a real
 * interaction puts it there. This module is only the assembler; the reveal and
 * its trade-offs are documented there.
 */
export function getEmail(): string | null {
  const parts = site.email
  if (!parts) return null
  return [parts.user, parts.domain].join('@')
}

/**
 * Whether an address is published, without assembling one. Callers that only
 * need to decide whether to render the block use this, so the joined string is
 * never built until someone actually reaches for it.
 */
export function hasEmail(): boolean {
  return site.email !== null
}

/** `mailto:` URL for {@link getEmail}, or null when no address is published. */
export function getMailtoHref(): string | null {
  const address = getEmail()
  return address ? `mailto:${address}` : null
}
