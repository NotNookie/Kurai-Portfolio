#!/usr/bin/env node
/**
 * Anti-harvesting check.
 *
 * `site.email` is stored in halves and joined at runtime so that no complete
 * address exists in the repo or in the build. That protection is invisible —
 * nothing breaks if someone writes the address whole in a data file, or if a
 * bundler upgrade starts constant-folding the join — so it needs asserting.
 *
 * Scans the source and, if it has been built, `dist/` for anything matching an
 * email address. Exits 1 on a hit, so it can gate a deploy.
 *
 * Usage:  npm run check:email
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

/** Deliberately loose — this should over-report rather than miss one. */
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

/**
 * Addresses that are meant to be in the source. `noreply@` appears in commit
 * trailers and `@types/` style scoped names are not addresses at all.
 */
const ALLOWED = [/noreply@anthropic\.com/, /\bexample\.com\b/, /\byour-address@/]

const SCAN = [
  { dir: join(ROOT, 'src'), exts: ['.ts', '.tsx', '.css', '.html'] },
  { dir: join(ROOT, 'scripts'), exts: ['.mjs'] },
  { dir: join(ROOT, 'dist'), exts: ['.js', '.css', '.html'] },
]

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const hits = []
let scanned = 0
let builtScanned = false

for (const { dir, exts } of SCAN) {
  if (!existsSync(dir)) continue
  if (dir.endsWith('dist')) builtScanned = true

  for (const file of walk(dir)) {
    if (!exts.includes(extname(file).toLowerCase())) continue
    if (!statSync(file).isFile()) continue
    scanned += 1

    const text = readFileSync(file, 'utf8')
    for (const match of text.matchAll(EMAIL)) {
      if (ALLOWED.some((re) => re.test(match[0]))) continue
      // This script necessarily contains the pattern that finds addresses.
      if (file === fileURLToPath(import.meta.url)) continue
      hits.push({ file: relative(ROOT, file).replace(/\\/g, '/'), address: match[0] })
    }
  }
}

console.log(`\nscanned ${scanned} files${builtScanned ? '' : ' (dist/ not built — run npm run build for full cover)'}`)

if (hits.length) {
  console.error('\n  a complete email address is present and harvestable:\n')
  for (const h of hits) console.error(`  ERROR  ${h.address}\n         in ${h.file}`)
  console.error(
    '\n  Addresses must be stored split in `site.email` and joined at runtime\n' +
      '  by getEmail() — see src/lib/email.ts.\n',
  )
  process.exit(1)
}

console.log('\n  all good — no whole address in the source or the build\n')
