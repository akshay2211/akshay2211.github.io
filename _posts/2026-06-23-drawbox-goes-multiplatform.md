---
title: "DrawBox Goes Multiplatform"
date: 2026-06-23
description: "Why I rewrote my Android-only drawing library for Kotlin Multiplatform, and the part of the rewrite that actually hurt."
image: /img/blog/drawbox-goes-multiplatform.svg
image_alt: "Banner for the DrawBox 2.0 KMP rewrite"
author: Akshay Sharma
tags:
  - kotlin multiplatform
  - compose multiplatform
  - drawbox
  - mvi
keywords:
  - drawbox kmp
  - kotlin multiplatform library
  - compose multiplatform canvas
  - mvi kotlin
  - android library to kmp
---

[DrawBox](https://github.com/akshay2211/DrawBox) has been an Android library since December 2021. A pen tool, an undo stack, a way to save what you drew — small surface area, did what it said. People picked it up, filed issues, sent PRs. It was happy living in `androidMain` and I was happy leaving it there.

Then my own work stopped being Android-only.

> **Try it in your browser:** the WASM build of the sample app is live at **[akshay2211.github.io/DrawBox/sample](https://akshay2211.github.io/DrawBox/sample/)** — no install, just draw.

## The honest reason for the rewrite

Nobody filed a "please port to iOS" issue. The push was personal: my day-to-day moved into Kotlin Multiplatform across Android, iOS, Web and Desktop, and it started feeling silly that my own drawing library was the one thing I couldn't reuse. A stroke is a stroke. An undo entry is an undo entry. The geometry, the serialization, the gesture interpretation — none of it has anything to do with Android specifically.

So the question stopped being *should this be multiplatform* and became *why is it still not*.

The refactor commit landed in late May 2026. The library is now `DrawBox 2.0`, shipped as a Compose Multiplatform artifact with Android, iOS, JVM/Desktop and WASM targets from one shared source set.

## What actually lives in `commonMain`

Almost everything. The shared module is split the way you'd expect if you've done this before:

- `domain/model` — `State`, `Intent`, `Event`, `Element`, `Geometry`, `Viewport`, `Serialization`, `BackgroundPattern`
- `domain/usecase` — `SvgExporter`, the rest of the use cases
- `presentation/viewmodel` — `DrawBoxController`
- `presentation/reducer` — one `Reducer.kt`, about 250 lines, where every state transition happens

The platform source sets — `androidMain`, `iosMain`, `jvmMain`, `wasmJsMain` — are thin. They exist to bridge things the Kotlin stdlib won't give you cross-platform: file IO, share sheets, the few graphics primitives that still differ. The drawing logic itself doesn't know what platform it's on.

## The part that actually hurt

This is the section the rewrite earned. Going from Android-only to KMP was the easy framing. The real work was rewriting the whole thing around **MVI and a single immutable state**.

The original DrawBox was a controller with mutable state — perfectly fine on one platform. Compose Multiplatform rewards a different model: one `State` data class, an `Intent` sealed type for every user action, a `Reducer` that takes `(State, Intent)` and returns the next `State`. Clean once it's done. Painful while you're getting there, because *every* feature has to be re-expressed as an intent and a reducer case. Pen-down, shape resize, eraser hit-test, viewport zoom, history step, JSON load — all of it funnels through the same 250 lines.

The payoff was the bit I underestimated:

- **Undo/redo is basically free.** History is just a stack of `State`. The reducer doesn't have to know it exists.
- **Serialization is free.** If `State` is `@Serializable`, then JSON import/export is mostly already done.
- **Replay is free.** The sample app has a replay screen because the architecture allowed it, not because I planned one.
- **Platforms can't drift.** WASM, iOS, Android and Desktop call the same reducer on the same state. If the eraser behaves differently on one of them, it's a rendering bug, not a logic bug — and the bug surface shrinks accordingly.

What it cost was the willingness to put the library on pause and rebuild features I'd already shipped, with no new user-visible win until the very end.

## What snuck in once the model was clean

Once everything was an `Element` in a `State`, adding features got noticeably cheap. The KMP branch picked up a lot more than just new targets:

- SVG export and JSON import/export
- Infinite canvas with zoom and pan
- Shape selection, drag and scale
- Connectors between shapes
- Stroke style and corner radius options
- A tileable SVG background pattern with optional tint
- An object eraser tool (replaces pan in the controls bar)
- Roborazzi for visual regression tests

Most of these would have been awkward in the old architecture. In the new one, they're a few lines in the reducer and an entry on the toolbar — and they ship on every platform at once. There's also [a live WASM sample](https://akshay2211.github.io/DrawBox/sample/) now, which has done more for "try it before you adopt it" than any README screenshot ever did.

## Would I do it again

Yes, but I'd stop pretending the migration paid off on merge day. It didn't. It paid off over the weeks after, when each new feature was small, symmetric across platforms, and didn't need a per-target branch.

If you maintain an Android-only library and your own work has quietly moved into KMP, the library is going to follow whether you plan for it or not. Better to do it deliberately than to let it slowly stop reflecting how you actually build things now.

<aside class="repo-star-cta">
  <div class="repo-star-cta-text">
    <p class="eyebrow">Liked the rewrite?</p>
    <p>If <strong>DrawBox 2.0</strong> finds its way into something you're shipping — Android, iOS, Desktop or Web — a star on GitHub is the easiest way to say thanks, and it genuinely helps other folks discover the library.</p>
  </div>
  <a class="repo-star-button" href="https://github.com/akshay2211/DrawBox" target="_blank" rel="noopener" aria-label="Star DrawBox on GitHub">
    <span class="repo-star-button-action">
      <svg class="gh-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      <svg class="star-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
      Star
    </span>
    <span class="repo-star-button-repo">akshay2211/DrawBox</span>
  </a>
</aside>
