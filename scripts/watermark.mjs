#!/usr/bin/env node
/**
 * Burns Kurai's signature into the gallery images.
 *
 * Reads untouched originals from `art-masters/` and writes watermarked copies
 * to `public/art/gallery/`. It never modifies a master, so it is safe to re-run
 * and the watermark can be restyled or removed at any time by editing the
 * settings below and running it again.
 *
 * The mark scales with the image. A fixed point size that reads as a discreet
 * signature on a 3000px illustration would cover a quarter of a 384px pixel
 * piece, so everything here is a fraction of the image width, with a floor so
 * it stays legible on the smallest pieces.
 *
 * Dimensions are preserved exactly — `npm run check:art` compares the declared
 * width/height against these files, so any resize would break the gallery.
 *
 * Usage:  npm run art:watermark
 */
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const MASTERS = join(ROOT, 'art-masters')
const OUT = join(ROOT, 'public/art/gallery')

/* ------------------------------------------------------------- appearance */

const TEXT = 'Hellane Kurai'

/** Cap height as a fraction of image width, then a floor in pixels. */
const SIZE_RATIO = 0.026
const MIN_SIZE = 11

/** Inset from the bottom-right corner, as a fraction of image width. */
const PAD_RATIO = 0.025
const MIN_PAD = 6

const FILL_OPACITY = 0.78
const SHADOW_OPACITY = 0.42

/**
 * Luminance above which the corner counts as light artwork.
 *
 * A fixed white mark disappears on pale work — Kurai's chibis are mostly white
 * background, and the first pass was practically invisible on them while
 * reading correctly on the darker illustrations. So the corner is sampled and
 * the mark flips to dark ink over light art.
 */
const LIGHT_THRESHOLD = 145

/**
 * WebP quality for re-encoding. The masters are already compressed, so this is
 * a second generation — 92 keeps that invisible at the cost of a little size.
 * PNGs (the pixel art) re-encode losslessly and ignore this.
 */
const WEBP_QUALITY = 92

/**
 * Mean luminance of the patch the mark will sit on, 0–255.
 *
 * Rec. 709 weights, because perceived brightness is mostly green — a flat RGB
 * average calls saturated pink "dark" and picks the wrong ink.
 */
async function cornerLuminance(file, width, height, size, pad) {
  // Rough text box: average glyph advance is about half the point size.
  const textW = Math.min(width, Math.round(size * 0.55 * TEXT.length))
  const textH = Math.round(size * 1.3)
  const left = Math.max(0, width - pad - textW)
  const top = Math.max(0, height - pad - textH)

  const { channels } = await sharp(file)
    .extract({
      left,
      top,
      width: Math.min(textW, width - left),
      height: Math.min(textH, height - top),
    })
    .stats()

  const [r, g, b] = channels
  if (!r || !g || !b) return 0
  return 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean
}

function overlay(width, height, isLight) {
  const size = Math.max(MIN_SIZE, Math.round(width * SIZE_RATIO))
  const pad = Math.max(MIN_PAD, Math.round(width * PAD_RATIO))
  const x = width - pad
  const y = height - pad

  const ink = isLight ? '#12101a' : '#ffffff'
  const shadow = isLight ? '#ffffff' : '#000000'

  // Escaped for XML: the text is ours, but the script should not break if it
  // ever gains an ampersand.
  const safe = TEXT.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${x + Math.max(1, Math.round(size * 0.06))}"
            y="${y + Math.max(1, Math.round(size * 0.06))}"
            text-anchor="end"
            font-family="Segoe UI, Helvetica Neue, Arial, sans-serif"
            font-size="${size}"
            font-weight="600"
            letter-spacing="${(size * 0.02).toFixed(2)}"
            fill="${shadow}" fill-opacity="${SHADOW_OPACITY}">${safe}</text>
      <text x="${x}" y="${y}"
            text-anchor="end"
            font-family="Segoe UI, Helvetica Neue, Arial, sans-serif"
            font-size="${size}"
            font-weight="600"
            letter-spacing="${(size * 0.02).toFixed(2)}"
            fill="${ink}" fill-opacity="${FILL_OPACITY}">${safe}</text>
    </svg>`,
  )
}

/* ------------------------------------------------------------------- run */

if (!existsSync(MASTERS)) {
  console.error(`\n  no masters directory at art-masters/\n`)
  process.exit(1)
}
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const files = readdirSync(MASTERS).filter((f) =>
  ['.webp', '.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()),
)

if (files.length === 0) {
  console.error('\n  art-masters/ is empty — nothing to watermark\n')
  process.exit(1)
}

let done = 0
const problems = []

for (const file of files) {
  const from = join(MASTERS, file)
  const to = join(OUT, file)

  try {
    const image = sharp(from)
    const { width, height, format } = await image.metadata()
    if (!width || !height) throw new Error('could not read dimensions')

    const size = Math.max(MIN_SIZE, Math.round(width * SIZE_RATIO))
    const pad = Math.max(MIN_PAD, Math.round(width * PAD_RATIO))
    const luminance = await cornerLuminance(from, width, height, size, pad)
    const isLight = luminance > LIGHT_THRESHOLD

    const pipeline = sharp(from)
      .composite([{ input: overlay(width, height, isLight), top: 0, left: 0 }])

    const encoded =
      format === 'png'
        ? pipeline.png({ compressionLevel: 9 })
        : pipeline.webp({ quality: WEBP_QUALITY })

    const buffer = await encoded.toBuffer()

    // Verify before overwriting: a size change would silently break the
    // gallery's declared dimensions.
    const check = await sharp(buffer).metadata()
    if (check.width !== width || check.height !== height) {
      throw new Error(`size changed ${width}x${height} -> ${check.width}x${check.height}`)
    }

    await sharp(buffer).toFile(to)
    console.log(
      `  ${basename(file).padEnd(34)} ${String(width).padStart(4)}px -> ${String(size).padStart(2)}px mark, ` +
        `corner luma ${String(Math.round(luminance)).padStart(3)} -> ${isLight ? 'dark ink' : 'white ink'}`,
    )
    done += 1
  } catch (error) {
    problems.push(`${file}: ${error.message}`)
  }
}

console.log(`\n  watermarked ${done}/${files.length}`)

/*
 * Anything in the gallery with no master behind it never passes through this
 * script, so it ships unmarked and nothing says so. That is the easy mistake
 * here: the old workflow was to drop files straight into public/art/gallery/,
 * and doing that now silently skips the watermark.
 */
const masters = new Set(files)
const unmanaged = readdirSync(OUT).filter(
  (f) => ['.webp', '.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()) && !masters.has(f),
)

if (unmanaged.length) {
  console.warn(
    `\n  WARNING  ${unmanaged.length} file(s) in the gallery have no master and are NOT watermarked:`,
  )
  for (const f of unmanaged) console.warn(`           ${f}`)
  console.warn('           Move them into art-masters/ and re-run.')
}

if (problems.length) {
  console.error('\n  problems:')
  for (const p of problems) console.error(`  ERROR  ${p}`)
  console.error('')
  process.exit(1)
}

console.log('  masters in art-masters/ are untouched\n')
