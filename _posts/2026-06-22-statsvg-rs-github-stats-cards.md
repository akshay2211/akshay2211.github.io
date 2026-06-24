---
title: "statsvg_rs: GitHub Stats Cards I Actually Control"
date: 2026-06-22
description: "Why I built my own GitHub stats card renderer in Rust, how it works, and how it publishes itself as static SVGs every six hours."
image: /img/blog/statsvg-rs.svg
image_alt: "statsvg_rs banner showing a dark GitHub stats card with tiles, a contribution grid, and language bars"
author: Akshay Sharma
tags:
  - rust
  - github
  - side project
  - svg
keywords:
  - github stats card
  - rust svg
  - github readme stats
  - github actions
  - github pages
---

For a while my GitHub profile had a small pile of stats cards on it. One for streaks, one for top languages, one for repo counts. Each came from a different service, each looked slightly different, and none of them could be told to show *exactly* what I wanted. If I needed a compact card for a project README and a fuller one for my profile page, I was out of luck — the tools gave me one shape and that was that.

So I built [statsvg_rs](https://github.com/akshay2211/statsvg_rs): a single Rust program that renders GitHub stats cards as SVG, with enough knobs that one tool can produce a header-heavy profile card *and* a stripped-down lifetime-stats card from the same code.

## What it actually makes

There are two presets, and the difference is the whole point.

**`profile.svg`** is the card you drop into a project README, where the reader doesn't know who you are yet. It leans on identity: avatar, bio, location, a row of last-year stats, a contribution grid, top languages, and pinned repos.

**`stats.svg`** is what I call the anti-profile. It's meant for your profile README — the `username/username` repo — where your avatar and bio are already sitting right above it. So it drops all of that and instead shows the things GitHub tends to hide: **lifetime contributions since you joined**, your longest streak, all-time stars and commits, the top repos you've contributed to but don't own, and your single most-starred project as a highlight.

Both are driven by the same flags. Width, theme (`github_dark`, `nord`, `dracula`, `light`, `solarized`), which sections to show or hide, how many pinned repos, an optional highlight line. If you want a profile card with no contribution grid, that's one flag. If you want the lifetime variant but with the header back on, that's one flag too. That flexibility is the feature I couldn't find anywhere else.

## How it works

The flow is short and boring in a good way, which is what I wanted.

1. **Fetch.** One GraphQL query to GitHub pulls the user, their repos, languages, contribution calendar, pinned items, and contributed-to repos. The lifetime variant fires a few extra queries — more on that below.
2. **Compute.** From that raw data it derives the numbers: total stars and forks, language percentages by bytes of code, current and longest streak from the calendar, and the last ~18 weeks of the contribution grid.
3. **Render.** It builds the SVG as a plain string, section by section, top to bottom. There's no templating engine and no headless browser — just a small builder that keeps a running vertical cursor and writes one section after another.

A couple of details I'm quietly happy with. The avatar is fetched and **base64-embedded directly into the SVG**, so the card is fully self-contained — no external image request when someone loads it. And themes are just plain Rust structs; adding a new one is a constant declaration and a single line to register it, no config format to invent.

For the lifetime numbers there's a wrinkle worth calling out. GitHub's API only gives you contribution totals for a date range, not a true "since the beginning of time" number. So to get a real lifetime total, statsvg_rs asks for each year from your join date to now — one query per year — and sums them. The per-year requests fan out concurrently so it stays fast even for an account that's been around a decade.

## How I deploy it, and why

Here's the part I went back and forth on. The project can run as a live HTTP server — there's an axum server mode and a Dockerfile — but I don't deploy it that way. I render to static files instead.

A GitHub Action runs on a schedule (every six hours), builds the binary, renders both `profile.svg` and `stats.svg`, generates a tiny landing page, and publishes the whole thing to GitHub Pages. The cards you embed are just static files sitting on a CDN.

I picked this for two plain reasons:

- **There's nothing to keep alive.** No server to pay for, monitor, or restart at 2am. A scheduled job either runs or it doesn't, and if it doesn't, the last good card is still sitting there.
- **It's faster and more reliable for whoever's looking at it.** A static SVG from a CDN always loads instantly. A live server has cold starts, can go down, and gets hit on every single README view — which is exactly how the shared instances of other stats tools end up rate-limited and broken.

Rendering on a schedule means GitHub's API gets called a handful of times a day on my terms, not once per page view by every visitor. The server mode still earns its keep, though — it's how I iterate on layout locally. `cargo run`, hit `localhost:3000` with different query params, and watch the card change without waiting on a full render-and-deploy cycle.

## How you can use it

If you want your own copy, it's a fork-and-edit job:

1. Fork the repo.
2. Open `.github/workflows/render.yml` and set `STATSVG_USER` to your GitHub login (and a theme/width if you like).
3. Turn on GitHub Pages with the source set to **GitHub Actions**.
4. Push. Your cards publish to `https://<you>.github.io/<repo>/profile.svg` and `/stats.svg`.

If you want private-repo data counted, generate a classic token with `repo` scope and add it as a repo secret — otherwise it just uses public data. Then embed whichever card fits where you're putting it.

That last part is how I run it myself: the **stats card lives on my profile README at `akshay2211/akshay2211`**, and the **profile card sits in the README of my [DrawBox](https://github.com/akshay2211/DrawBox) project**. Same tool, two genuinely different cards, each tuned for where it's shown.

## What was actually hard

Honestly? Not much fought me. The mechanics — GraphQL, the SVG building, the Actions pipeline — mostly just worked once they were wired up. The real work wasn't debugging, it was *deciding*: what belongs on a profile card versus a stats card, what's noise, what GitHub already shows the viewer so I shouldn't repeat it. The anti-profile idea came out of that question, not out of any technical struggle.

The few things I had to design *around* rather than fight were all just realities of the platform. Lifetime totals needing a query per year, as mentioned. GitHub's image proxy caching embedded SVGs, which is part of why re-rendering every six hours (rather than chasing real-time) is the right cadence — and why there's a `?v=` cache-bust trick in the README for when you want a card refreshed immediately. And the layout being hand-tracked rather than handed to a layout engine, which is more arithmetic but also means there's no surprise dependency between me and the pixels.

If you've got a wall of mismatched cards on your profile and you've ever wished one of them did something slightly different, that's the itch this scratches. The code is on [GitHub](https://github.com/akshay2211/statsvg_rs) — fork it, point it at your username, and make it show what you actually want.

<aside class="repo-star-cta">
  <div class="repo-star-cta-text">
    <p class="eyebrow">Found this useful?</p>
    <p>If <strong>statsvg_rs</strong> ends up rendering the cards on your profile, a star on GitHub is the easiest way to say thanks — and it nudges the repo into other people's search results too.</p>
  </div>
  <a class="repo-star-button" href="https://github.com/akshay2211/statsvg_rs" target="_blank" rel="noopener" aria-label="Star statsvg_rs on GitHub">
    <span class="repo-star-button-action">
      <svg class="gh-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      <svg class="star-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
      Star
    </span>
    <span class="repo-star-button-repo">akshay2211/statsvg_rs</span>
  </a>
</aside>
