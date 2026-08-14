#!/usr/bin/env node
/**
 * Artwork integrity check.
 *
 * Verifies that `src/data/artworks.ts` and the files in `public/art/` agree.
 * `npm run build` cannot catch any of this — TypeScript happily compiles an
 * entry whose image does not exist, or whose declared dimensions are wrong.
 *
 * Checks:
 *   1. Every referenced image exists on disk.
 *   2. Every image on disk is referenced by an entry.
 *   3. Slugs are unique (duplicates make `?piece=` unreachable).
 *   4. Declared `width`/`height` match the file's real pixel dimensions.
 *   5. Alt text is present and is not just the title repeated.
 *   6. Filenames are deploy-safe (no spaces, lowercase extension).
 *   7. Static asset paths in index.html resolve (favicon, og:image).
 *
 * Dimensions are read straight from the image headers, so this needs no
 * dependencies and runs anywhere Node does.
 *
 * Usage:  npm run check:art
 * Exits 1 on any error, so it can gate a deploy.
 */
import { readFileSync, readdirSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { join, relative, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DATA = join(ROOT, 'src/data/artworks.ts')
const PUBLIC = join(ROOT, 'public')
const ART_DIR = join(PUBLIC, 'art')

/* ------------------------------------------------------ image dimensions */

/** Reads the first `length` bytes of a file without loading the whole thing. */
function readHead(file, length = 64) {
  const fd = openSync(file, 'r')
  try {
    const buf = Buffer.alloc(length)
    const bytes = readSync(fd, buf, 0, length, 0)
    return buf.subarray(0, bytes)
  } finally {
    closeSync(fd)
  }
}

function pngSize(b) {
  // 8-byte signature, then the IHDR chunk: width and height are big-endian
  // 32-bit ints at offsets 16 and 20.
  if (b.length < 24) return null
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
}

function webpSize(b) {
  if (b.length < 30 || b.toString('ascii', 8, 12) !== 'WEBP') return null
  const chunk = b.toString('ascii', 12, 16)

  if (chunk === 'VP8X') {
    // Extended format: 24-bit little-endian, stored as (value - 1).
    return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
  }
  if (chunk === 'VP8 ') {
    // Lossy: 3-byte sync code, then 14-bit width and height.
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    // Lossless: 0x2f signature, then 14 bits each, stored as (value - 1).
    if (b[20] !== 0x2f) return null
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return null
}

function gifSize(b) {
  if (b.length < 10) return null
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) }
}

function jpegSize(file) {
  // JPEG needs a scan: dimensions live in a start-of-frame marker whose
  // position depends on how much metadata precedes it.
  const b = readFileSync(file)
  let i = 2
  while (i < b.length) {
    if (b[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = b[i + 1]
    // SOF0–SOF15, excluding the non-frame markers DHT/JPG/DAC.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
    }
    i += 2 + b.readUInt16BE(i + 2)
  }
  return null
}

function imageSize(file) {
  const ext = extname(file).toLowerCase()
  if (ext === '.png') return pngSize(readHead(file, 32))
  if (ext === '.webp') return webpSize(readHead(file, 32))
  if (ext === '.gif') return gifSize(readHead(file, 16))
  if (ext === '.jpg' || ext === '.jpeg') return jpegSize(file)
  return null
}

/* ---------------------------------------------------------- data parsing */

const source = readFileSync(DATA, 'utf8')

const slugs = [...source.matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1])
const titles = [...source.matchAll(/^\s*title: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/gm)].map(
  (m) => m[1] ?? m[2],
)

/**
 * Every ArtworkImage is written as src / alt / width / height in that order,
 * which matches covers and variant images alike. Both quote styles are accepted
 * because an alt containing an apostrophe is written with double quotes.
 */
const QUOTED = `(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`
const imageRe = new RegExp(
  `src: '([^']+)',\\s*\\n\\s*alt: ${QUOTED},\\s*\\n\\s*width: (\\d+),\\s*\\n\\s*height: (\\d+)`,
  'g',
)

const images = [...source.matchAll(imageRe)].map((m) => ({
  src: m[1],
  alt: m[2] ?? m[3] ?? '',
  width: Number(m[4]),
  height: Number(m[5]),
}))

/* ------------------------------------------------------------- reporting */

const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

/* 1 + 4 + 5 — referenced images resolve, and their metadata is right. */
const referenced = new Set()

for (const img of images) {
  const file = join(PUBLIC, img.src.replace(/^\//, ''))
  referenced.add(file)

  let stat
  try {
    stat = statSync(file)
  } catch {
    err(`missing file: ${img.src}`)
    continue
  }
  if (!stat.isFile()) {
    err(`not a file: ${img.src}`)
    continue
  }

  if (!img.alt.trim()) err(`empty alt: ${img.src}`)
  else if (titles.some((t) => t && t.toLowerCase() === img.alt.trim().toLowerCase())) {
    warn(`alt repeats the title verbatim: ${img.src}`)
  }

  const size = imageSize(file)
  if (!size || !size.width || !size.height) {
    warn(`could not read dimensions (unsupported format?): ${img.src}`)
    continue
  }

  /*
   * Dimensions must match the file exactly. They used to be a hand-written
   * `aspect: '3 / 4'` string checked with a 1% drift tolerance, which allowed a
   * ratio that was merely close. Now they are the real numbers, so anything but
   * an exact match is an error — the UI sizes tiles off these, and a wrong
   * width would let a piece be drawn past its own resolution.
   */
  if (img.width !== size.width || img.height !== size.height) {
    err(
      `dimensions do not match the file: ${img.src}\n` +
        `      declared ${img.width}x${img.height}, file is ${size.width}x${size.height}\n` +
        `      fix: width: ${size.width}, height: ${size.height}`,
    )
  }
}

/* 2 — nothing on disk is orphaned. */
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

let onDisk = []
try {
  onDisk = walk(ART_DIR)
} catch {
  err(`artwork directory not found: ${relative(ROOT, ART_DIR)}`)
}

for (const file of onDisk) {
  if (!referenced.has(file)) {
    warn(`on disk but never referenced: ${relative(PUBLIC, file).replace(/\\/g, '/')}`)
  }

  /* 6 — filenames that break once deployed. */
  const name = basename(file)
  if (/\s/.test(name)) err(`filename contains a space (needs URL-encoding): ${name}`)
  if (extname(name) !== extname(name).toLowerCase()) {
    err(`uppercase extension breaks on case-sensitive hosts: ${name}`)
  }
}

/*
 * 7 — static assets referenced from index.html.
 *
 * These are invisible failures: nothing in the build resolves them, so a
 * favicon or og:image pointing at a deleted file ships happily and only shows
 * up as a blank link preview weeks later. That is exactly how og:image came to
 * reference a placeholder that had been deleted with the rest of them.
 */
const ASSET_EXT = ['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg', '.ico']
const html = readFileSync(join(ROOT, 'index.html'), 'utf8')

for (const m of html.matchAll(/(?:href|src|content)="(\/[^"]+)"/g)) {
  const ref = m[1]
  // /src/* is the dev entry, rewritten by Vite at build time — not a real file
  // in public/.
  if (ref.startsWith('/src/')) continue
  if (!ASSET_EXT.includes(extname(ref).toLowerCase())) continue

  try {
    if (!statSync(join(PUBLIC, ref.replace(/^\//, ''))).isFile()) throw new Error()
  } catch {
    err(`index.html references a file that does not exist: ${ref}`)
  }
}

/* 3 — slug collisions. */
const seen = new Set()
for (const slug of slugs) {
  if (seen.has(slug)) err(`duplicate slug "${slug}" — the later entry is unreachable`)
  seen.add(slug)
}

/* ---------------------------------------------------------------- output */

console.log(
  `\nchecked ${slugs.length} entries · ${images.length} images referenced · ` +
    `${onDisk.length} files on disk\n`,
)

for (const w of warnings) console.log(`  WARN   ${w}`)
for (const e of errors) console.log(`  ERROR  ${e}`)

if (errors.length === 0 && warnings.length === 0) {
  console.log('  all good — data and files agree\n')
} else {
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)\n`)
}

process.exit(errors.length > 0 ? 1 : 0)
