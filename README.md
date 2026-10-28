# The Garden Barber Guernsey — website

Single-page site in plain HTML, Tailwind CSS v3 (compiled and committed) and a small vanilla JS file. No frameworks, no runtime CDNs.

```
npm install      # first time only
npm run build    # rebuild assets/css/styles.css after any change
npm run watch    # rebuild automatically while editing
```

## Folder layout

```
index.html              The whole site, sections split by big comment banners
thanks.html             Shown after the quote form is sent
404.html                "Page not found" (uses <base href="/the-garden-barber/">, see checklist)
assets/css/styles.css   Compiled Tailwind – generated, don't edit by hand
assets/js/main.js       Menu, scroll reveals, header, services tabs, before/after, lightbox, form
assets/fonts/           Josefin Sans + Figtree (woff2) with their OFL licences
images/brand/           Logo, horizontal logo and mark as SVG (dark and white versions)
images/work/            Work photos – name.webp (large) + name-sm.webp (800px)
images/                 Favicons, app icons, og-image.jpg (1200×630 share card), site.webmanifest
src/input.css           Tailwind source: @font-face, buttons, form fields, slider + lightbox styles
tailwind.config.js      Brand colours, fonts and the hero animations
sitemap.xml, robots.txt
_fb-pack/               Facebook research pack (not published – see Source)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| sage-500 | `#5a7765` | The logo background colour; icons, ticks |
| sage-700 | `#3d5546` | Logo shading; main buttons, theme colour, favicon |
| sage-800 / 950 | `#2f4337` / `#17211c` | About band, footer |
| sage-50 – 300 | `#f2f5f2` – `#a3b8a9` | Panels, tab backgrounds, illustration fills |
| ink | `#0d1611` | Logo lettering (softened) – logo SVGs |
| paper | `#f7f5ef` | Page background |
| sleeper-300 – 600 | `#e2c99c` – `#97703b` | Small warm accents, taken from the timber sleeper and Alderney gravel in their work photos |

- **Fonts:** Josefin Sans (headings and spaced capitals – close to the logo lettering) and Figtree (body), self-hosted from @fontsource.
- **Logo:** traced from the Facebook profile image into clean SVG (`images/brand/`). Same secateurs-and-laurel mark and lettering, nothing redrawn or changed.
- **Illustrations:** the clipped hedge and shears, laurel sprig and lawn mower are inline SVG in `index.html` (hero section and the strip below it). The shears snip and the mower crosses the striped strip; both stop for visitors who prefer reduced motion.

## Editing

- **Text:** everything is in `index.html`. Search for the words you want to change.
- **Colours:** change them in `tailwind.config.js`, then run `npm run build`.
- **Services explorer:** each service is a `<button role="tab">` in the tab list plus a matching `<article class="svc-panel">`. Copy one of each, give them new ids (`tab-x` / `svc-x`) and point `aria-controls` / `aria-labelledby` at each other. Add the service name to the form's `<select>` too, and set the panel button's `data-service` to the same text so it pre-selects it.
- **Adding a work photo:** make `name.webp` (~1600px wide, or the original size) and `name-sm.webp` (800px), put them in `images/work/`, then copy one of the `<button class="gal-item">` blocks in the Recent work section. Update `data-full`, `data-caption`, the `src`, `width`/`height` and `alt`. Tile size is set with `col-span-2` / `row-span-2` / `lg:col-span-3`.
- **Before & after:** each slider is a `<div class="ba" data-ba>` with the *after* image first and the *before* image inside `.ba-before`. Both photos must be the same size and framing.

## Before going live — checklist

- [ ] Swap `https://tobygregg.github.io/the-garden-barber/` for the real domain everywhere: canonical and `og:` tags, Twitter image, JSON-LD, `sitemap.xml`, `robots.txt`, the form's `_next`, thanks.html canonical. Change the `<base href>` in `404.html` to `/`.
- [ ] **When the client goes ahead, switch the form from Toby's email (`formsubmit.co/toby1@greggs.org`) to the client's email, change the `_subject`, and activate FormSubmit** (it emails a confirmation link on the first submission).
- [ ] Confirm phone (07781 415122) and email (thegardenbarberguernsey@gmail.com).
- [ ] Get the client to sign off the services wording – especially:
  - "Gravel & sleeper areas" as its own service (based on the one fire-pit post).
  - "One-off tidy-ups or regular visits" under maintenance (assumed from "Garden Maintenance").
  - Teak furniture restoration shown as a before & after – is it something they offer?
  - "Clear pricing", "punctual and reliable" and "considerate" are taken from the only written review.
  - Nial's name comes from that review. Check he's happy to be named.
  - "Around the island" – the page only lists "Guernsey, GY1". Ask which areas they cover.
- [ ] No hedge-cutting photo in the pack. The Hedge cutting panel uses a crop of trimmed shrubs (`shrubs-trimmed.webp`). Ask for a proper hedge photo and swap it in.
- [ ] Ask for more photos and two or three more written reviews. With 3+ reviews a testimonials section can be added (there's only one written review so far, so none is shown).
- [ ] Ask whether they're insured / offer free quotes – neither is claimed on the site because the pack doesn't say.
- Left out from the pack: the Facebook cover image (a stock-style cottage photo, not their work) and follower/review counts.

## Source

Built from the Facebook pack in `_fb-pack/` (BRIEF.md, data.json, images). The folder starts with an underscore so GitHub Pages doesn't publish it, and `robots.txt` disallows it as well.
