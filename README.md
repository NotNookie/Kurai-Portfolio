# Hellane Kurai — Portfolio

Illustrator and character-design portfolio. React 19 + TypeScript + Vite, CSS Modules,
client-side routing. Single light theme, pop-cute direction.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run typecheck  # tsc only
npm run lint       # eslint
```


## Where things live

```
public/
  art/gallery/           every gallery image        ← drop files here
src/
  assets/                brand images, hashed by Vite
                           kuraiCover.png  hero background (vgen cover art)
                           kuraiPfp.png    avatar, used as the nav mark
                           drawing.png     decorative chibi
  data/                  ★ ALL CONTENT — the only files Kurai needs to edit
    site.ts                copy: nav, hero, page headings, about, contact, viewer
    artworks.ts            the whole gallery, one flat list
    socials.ts             every outbound link, and where each appears
  types/content.ts       the content contract shared by data and components
  lib/content.ts         read-only selectors over the data layer
  styles/
    tokens.css             design tokens — colour, type, space, motion
    global.css             reset, base elements, focus, reduced motion
  components/
    ui/                    Button, Container, Icon, Ornament, Tabs
    art/                   ArtImage, ArtworkTile, ArtworkLightbox
    layout/                Header, Footer, RootLayout, RouteError, RouteFallback
    sections/              Hero, ArtMarquee, AboutTeaser, ContactCta
  pages/                   Home, Gallery, About, Contact, NotFound
  routes.tsx               route table (all pages except Home are code-split)
```

**The rule that keeps this maintainable:** components never contain copy and never
import from `src/data/*` directly — they read through `src/lib/content.ts`. Rewriting
any string, or swapping the whole data layer for a CMS, touches no component.

---

## Routes

| Path | What it is |
| --- | --- |
| `/` | Hero → auto-looping marquee → about teaser → contact CTA |
| `/illustrations` | The gallery. `?category=` filters, `?piece=` opens the lightbox |
| `/about` | Bio |
| `/contact` | Links only — commissions route to VGen |
| anything else | 404 |

Both the filter and the open artwork live in the query string, so a filtered view and
an individual piece are each a shareable URL that survives a refresh and works with the
back button. The lightbox pages through the *filtered* list, so arrowing never jumps to
something the visitor has filtered out.

---

## Adding artwork

1. Put the image in `public/art/gallery/`.
2. Add an entry to `src/data/artworks.ts`, copying an existing one.
3. `slug` becomes the `?piece=` value — lowercase and hyphenated, and unique. A
   duplicate logs an error in the dev console.
4. `aspect` must match the real image ratio (`'3 / 4'`, `'16 / 9'`, …). It reserves the
   tile before the file loads, which is what keeps the masonry from jumping.
5. `alt` describes what is depicted; never just repeat the title.
6. `featured: true` puts the piece in the home-page marquee.
7. `variants` is optional — supply it only for genuine alternate art. The tabs hide
   themselves when it is absent.

---

## Handing the content over to Kurai (Decap CMS)

Decap gives her an admin UI at `/admin` where she drags images in and fills fields; it
commits to GitHub, which triggers a redeploy. Free, git-based, no database.

**Prerequisites it needs that this repo does not have yet:** the project must be in a Git
repository, pushed to GitHub, and deployed somewhere that can run its OAuth handshake
(Netlify does this out of the box; Vercel needs a small OAuth function).

Once that is true:

1. `npm install decap-cms-app`
2. Create `public/admin/index.html` mounting the CMS, and `public/admin/config.yml`.
3. Mirror the `Artwork` type as a collection — it was designed to map one-to-one:

   ```yaml
   collections:
     - name: artworks
       label: Illustrations
       folder: src/content/artworks
       create: true
       slug: '{{fields.slug}}'
       media_folder: /public/art/gallery
       public_folder: /art/gallery
       fields:
         - { name: title,       widget: string }
         - { name: slug,        widget: string }
         - { name: eyebrow,     widget: string, hint: 'e.g. Original Character' }
         - { name: year,        widget: number, value_type: int }
         - { name: category,    widget: select,
             options: [character-design, illustration, chibi, emote, environment, editorial] }
         - { name: featured,    widget: boolean, default: false }
         - { name: description, widget: text }
         - label: Cover
           name: cover
           widget: object
           fields:
             - { name: src,    widget: image }
             - { name: alt,    widget: string, hint: 'Describe what is depicted.' }
             - { name: aspect, widget: string, default: '3 / 4' }
   ```

4. Replace the hand-written array in `src/data/artworks.ts` with a glob over the
   generated folder. The exported symbol and its type stay identical, so nothing
   downstream changes:

   ```ts
   const files = import.meta.glob<{ default: Artwork }>('../content/artworks/*.json', {
     eager: true,
   })
   export const artworks: readonly Artwork[] = Object.values(files).map((m) => m.default)
   ```

Because `src/lib/content.ts` is the only thing components read from, step 4 is the
entire migration. Nothing in `components/` or `pages/` is touched.

Interim fallback with no tooling at all: she edits `src/data/artworks.ts` directly,
following the comments at the top of the file.

---

## Design tokens

`src/styles/tokens.css` has two layers. **Palette** tokens (`--plum-800`, `--pink-300`)
are raw brand hues with no contrast guarantees and are never used directly by
components. **Semantic** tokens (`--text`, `--accent`, `--surface`) are what components
use.

Contrast rules that are easy to get wrong here, and were:

- Ratios are measured against **`--bg-sunken`**, not the page background — the sunken
  surface is the darkest ground text sits on, and it is the binding constraint. A muted
  token that passes on `--bg` can still fail in the footer.
- The raw pink and cyan from the cover art are far too light to carry text. They are
  confined to `--decor-*` and are ornament only.
- Text on a tinted chip needs its own token. `--accent` on `--decor-pink-soft` measures
  4.46 and fails; use **`--on-decor-pink`** / **`--on-decor-cyan`** inside `--decor-*`
  fills.

Ornaments (`Blob`, `DotField`) are `aria-hidden` and `pointer-events: none`. They are
absolutely positioned and bleed past section edges, which is why `body` sets
`overflow-x: hidden` and ornamented sections set `overflow: hidden; isolation: isolate`.

**Watch the stacking contexts.** Ornaments and the hero backdrop sit at `z-index: -1`.
An ancestor with a `background-color` must also establish a stacking context
(`isolation: isolate`), or the negative-z child paints *behind that background* and
disappears. This is exactly what hid the hero cover art during development.

---

## Accessibility

Verified with axe-core across all routes at 1280px and 430px: **0 violations.**

- Skip link, one `<h1>` per page, heading levels never skip
- The lightbox is a real modal dialog: focus moves in on open, is trapped across Tab,
  and returns to the tile that opened it; Escape closes; background scroll is locked
- The thumbnail rail and variant tabs are WAI-ARIA tabs with roving focus
- Gallery tiles show no visible text, so each button takes its accessible name from a
  visually-hidden `"{title} — Open in viewer"`
- Route changes announce the new document title through a live region
- `prefers-reduced-motion` is honoured globally in CSS and per-component via framer
  motion's `useReducedMotion`. The marquee **stops entirely** and drops its duplicate
  track rather than slowing down — a slow infinite crawl is still a vestibular trigger.
  Drag-to-swipe is disabled outright.

Re-run the audit after content changes; artwork `alt` text is the easiest thing to get
wrong.

---

## Known issues / next steps

1. **The hero image is 1.18 MB.** `kuraiCover.png` is the largest asset by an order of
   magnitude and it is the LCP element. Converting it (and future artwork) to WebP/AVIF
   would cut roughly 70%. Needs a decision: export WebP by hand, or add
   `vite-plugin-image-optimizer` (pulls in `sharp`, ~30 MB in `node_modules`). Not done
   because it adds a build dependency.
2. **`react-router` 7.18.2 carries a high-severity advisory** for a CSRF bypass in its
   RSC mode. This app is a static client-rendered SPA using neither RSC nor
   react-router's server runtime, so the vulnerable path is not reachable. No patched
   7.x release yet — re-check `npm audit` periodically.
3. **All copy is placeholder.** Every string needing Kurai's input is marked
   `TODO(kurai)`; nothing invents biography, clients, location, or years active. Search
   the repo for `TODO(kurai)`.
4. **The Bluesky handle was read off the cover art**, not from a supplied link — confirm
   or delete that entry in `src/data/socials.ts`.
5. **Gallery entries reuse the same three images** as placeholders.
6. `site.url` and the Open Graph tags in `index.html` need the real domain.
7. The site is English-only by decision. If a second language is ever wanted, the shape
   to reach for is `{ en, ja }` per value in `src/data/site.ts` plus a small accessor —
   a change to the data layer, not a rebuild.
