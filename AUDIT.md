# AUDIT.md — current state of ak1.io

Written before starting Workstream 1, from reading the repo (not just rendered
HTML). Where this contradicts `AK1-BRIEF.md`, the repo wins and it is noted.

## Stack (corrections to brief)

- **Jekyll 4.4.1**, not 3.10 as the brief states. `jekyll-sass-converter` 3.1 is
  present, so SCSS is available if we want it (currently unused — plain CSS).
- Plugins: `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed` — all present.
- No build step beyond Jekyll. Two CSS files: `css/style.css` (hand-written,
  843 lines, single file) and `css/bootstrap-grid.css` (grid utility — appears
  largely unused by current markup; candidate for removal later).
- JS: `js/load.js` (theme toggle, social icons, scroll state) and `js/toc.js`.

## Type scale in use (Workstream 1 target)

Ad hoc, not tokenised. Fonts loaded from Google Fonts (`Poppins` 100–600,
`Quicksand` 300–700) via `<link>` with `display=swap` — **not self-hosted, not
preloaded**. Body is `Quicksand` 500; headings `Poppins`. Sizes are a mix of
`em`, `px`, and `clamp()` with per-element line-heights. No modular scale, no
`--font-size-*` tokens.

## Colour / theming (Workstream 1 target)

- Dark is default; `body.light-mode` overrides. Toggled by `dayNightToggle()` in
  `js/load.js`, persisted in `localStorage` under key `light-mode`.
- Tokens exist as CSS custom properties (`--bg --fg --muted --soft --line
  --line-strong --card --card-hover --accent`) — good foundation.
- **But** they are raw hex + `rgba()`, not Radix scales, and there are raw
  colour literals scattered in component CSS (shadows `rgba(0,0,0,.55)`, accent
  glows `rgba(233,196,106,...)`, `#1d1e21` in `::selection`). Not tokenised to
  the brief's standard.
- No spacing tokens; padding/margins are magic px values throughout.

## Motion (Workstream 7 — partially done already)

- `@view-transition { navigation: auto; }` **already present** with a tuned root
  cross-fade (`css/style.css:281`). Header/footer are **not** named, no
  shared-element banner morph, no nav-indicator, no circular-reveal theme toggle.
- Home hero has an entrance animation (staggered `home-rise`) — the brief's
  MOTION.md §7 explicitly says *no entrance animation on hero text*. **Conflict
  to resolve in W7/W2.**
- A `prefers-reduced-motion` block exists but only covers the hero + view
  transition, not the global `*` reset MOTION.md §6 wants.
- `consult-pulse` keyframe pulses the availability dot (gated for reduced motion).

## What the brief lists as TODO but is ALREADY DONE

- **W4 Twitter handle:** `_config.yml` already sets `twitter.username: _akshay22`
  and `twitter.card: summary_large_image` globally. The `@Akshay Sharma` bug is
  already fixed. (seo-tag emits `twitter:creator` from `twitter.username`.)
- **W4 RSS discoverability:** `<link rel="alternate" type="application/atom+xml">`
  is present in `_layouts/default.html`.
- **W4 sitemap:** `jekyll-sitemap` active.
- **W4 post og:image:** every post has `image` + `image_alt` front matter; seo-tag
  emits `og:image` from it.
- **GA4:** already wired, production-only (`_layouts/default.html:24`).
- **Sticky nav + `aria-current`:** present and correct.
- **Footer** (email/RSS/GitHub/Redigit): present.
- **`llms.txt`:** present, live from `_data/projects.yml` + `site.posts`.
- **Consulting badge on home:** present (`home-consult`).

## What is genuinely still open

- **W1** Typography + real tokenisation (Radix, modular scale, spacing, self-host
  fonts). Not done.
- **W2** Homepage still shows only avatar + one line + "Read the journal →". No
  work above the fold. Not done.
- **W3** Projects: one flat list of 7 cards, no split, no install lines, no
  versions, no platform badges, no stars. `_data/projects.yml` has only
  `name/stack/lang/description/repo/post`. Not done.
- **W4 (remainder)** `/projects/` and `/blog/` have no `image` front matter, so
  they share as bare text despite the global `summary_large_image` card. Need an
  OG image for each (or per-section default).
- **W5** `.DS_Store` **and** `img/.DS_Store` are committed and `.gitignore` does
  **not** list `.DS_Store`. SVGO not run. Images mostly lack width/height. No
  `.editorconfig`. README has no fork note.
- **W6** Redigit funnel is one sentence + link. No `/hire/` page, no post-level CTA.
- **W7** Motion: see above — mostly open.
- **W8** Banner alt text: `shipping-small-useful-improvements` alt is generic
  ("Abstract code editor banner for a software blog post"). Generated banner
  system not built.
- **W9** No DrawBox demo.
- **W10** Arrows on nearly every link (`Read the journal →`, `View on GitHub →`,
  `Read post →`, `Read the story →`); all-caps tracked eyebrows everywhere;
  homepage positioning line is the generic "building thoughtful cross-platform
  apps and libraries".

## Order of execution (per brief §6 priority)

W1 → W3 → W2 → W4 → W5 → W6 → W7 → W8 → (W10 folded in along the way) → W9 last
(external, needs DrawBox repo). W0 (publish a post) is not a code task.
