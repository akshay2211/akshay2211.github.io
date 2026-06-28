---
title: "Giving Claude Memory of My Own Files — Locally"
date: 2026-06-28
description: "Why I built UCP, a local-first MCP server in Rust that turns notes, code, and every past Claude chat into one searchable tool — and the design call I keep getting asked about."
image: /img/blog/universal-context-pipeline.svg
image_alt: "UCP banner — a local-first MCP server grounding LLMs in your own files"
author: Akshay Sharma
tags:
  - rust
  - mcp
  - llm
  - local-first
  - side project
keywords:
  - local mcp server
  - claude desktop memory
  - rust rag
  - mcp tool
  - conversation memory
  - sqlite-vec
---

A few weeks ago I asked Claude something I was almost certain I'd asked it before — same problem, same project, a month earlier. The reply was useful, but it was also clearly a reply from someone meeting the question for the first time. Every prior session had evaporated. At the same time, the things that *would* have answered the question — my notes folder, the project's README, a transcript from a meeting — were sitting on my own disk, where Claude couldn't reach them.

Two gaps, same shape. The model is great at reasoning over whatever lands in its context, and useless at the part where context actually comes from.

So I built [UCP](https://github.com/akshay2211/universal-context-pipeline) — Universal Context Pipeline. A single Rust binary that indexes folders on my machine, then exposes them to any MCP client (Claude Desktop, Cursor, LM Studio, Zed, Continue, custom agents) as one tool: `search_local_context`. No cloud, no telemetry, no per-page-view API calls.

## What it actually is

UCP is a local-first [MCP](https://modelcontextprotocol.io/) server. You point it at folders — notes, code, exported Claude conversations, PDFs — and it builds a hybrid index on disk. When an MCP client launches it, the client sees exactly one new tool, and the LLM running in that client can call it whenever it needs grounding.

The retrieval underneath is the unglamorous part that quietly matters:

- **BM25 via SQLite FTS5** for exact terms (function names, error strings, that one weird acronym).
- **Vector search via `sqlite-vec`** for intent ("the thing that retries webhooks with exponential backoff").
- **Reciprocal-rank fusion** to merge the two — neither alone is good enough; together they handle both shapes of query.
- **Tree-sitter chunking** for Rust / Python / TS-JS, heading-aware chunking for Markdown, sentence-bounded fallback for everything else.
- **Content-hash embedding cache.** Re-index a folder where nothing changed and zero embedding calls are made.

Everything lives in one SQLite file. The whole thing is one binary on your `PATH`.

## The design call I keep defending: one tool, not ten

Most "context for LLMs" tools expose a constellation of MCP tools — `read_notes`, `search_code`, `find_conversations`, `list_pdfs`, and so on. I went the other way. UCP exposes exactly one tool to the model: `search_local_context(query, folder_filter?, limit?)`.

The reason is empirical, not philosophical. Agents have to *choose* a tool to call, and tool choice gets worse — sometimes much worse — as you add more tools that overlap in meaning. "Should I `search_code` or `read_notes` for this question?" is the kind of decision an LLM can faceplant on, and it's the kind of decision the *retriever* should be making anyway, because it's the one with the index in front of it.

So UCP collapses the decision: the model asks one question in natural language, the retriever decides whether to lean on BM25 or vectors or both, the model gets snippets with citations back. There's nothing for the agent to get wrong because there's nothing to choose.

The cost is that the tool description has to do real work — it has to tell the model when calling it is appropriate and when it isn't. That's a writing problem, not a protocol problem, and I'd rather solve it once in a docstring than push it into the model's tool-routing every turn.

## Why local-first, beyond the obvious

The privacy story writes itself — lawyers, clinicians, defense, anyone with an NDA, anyone who simply doesn't want their notes leaving the laptop. Pair UCP with a local model in LM Studio or Ollama and the whole stack — indexing, embeddings, retrieval, chat model — runs offline. Works on a plane. Works in an air-gapped facility. Works when the WiFi at the café decides today is not the day.

But the part I didn't expect was that **local-first is what makes the conversation-memory feature work at all**. Exporting your Claude history and uploading it to a third-party "memory" service is a non-starter for most people — it's the most intimate corpus you have. Doing it locally turns it from an awkward sell into a one-liner: `ucp-local ingest-conversations ~/Downloads/claude-export/conversations.json`. From that point on, every future Claude (or Cursor, or LM Studio) session can search every prior one. The thing that was missing the day I started building this — Claude remembering what we already worked through — became a `search_local_context` call.

## The bit I'm quietly happy with

The content-hash embedding cache. Embeddings are the expensive step — they hit Ollama, they take real wall-time, and the typical edit-a-file-and-re-index workflow re-touches a lot of chunks whose content hasn't actually changed. So every chunk is hashed; the hash is the cache key; on re-index, only chunks with a new hash hit the embedding model. The watcher (`ucp-local watch`) leans on this — you edit a file, the index updates in ~500ms because 99% of the chunks were already embedded last time.

It's a small thing. It also turns "re-index my big notes folder" from a coffee break into a beat.

## The part that actually hurt

PDFs. Specifically, PDFs whose body fonts don't ship a ToUnicode CMap.

The Rust `pdf-extract` crate is fine for most things, but on a particular shape of PDF — usually papers and corporate exports — it'll happily pull out the headings and lose the entire body. The text isn't missing from the file; it's just encoded in a way the extractor can't map back to characters without the CMap. You only notice when you query the index for a phrase you know is in the document and get nothing back.

The fix wasn't writing a better PDF parser (that way lies madness). It was admitting that `pdftotext` from Poppler already solves this and giving UCP a graceful fallback: try `pdf-extract` first, detect the "headings only, body missing" failure mode, fall back to `pdftotext` if it's on `PATH`. Poppler is now a documented optional dependency that I quietly recommend everyone install.

The lesson, again, was the unglamorous one: the hard part of grounding an LLM in your own files isn't the model or the embeddings or the retrieval algorithm. It's the long tail of file formats refusing to give up their text.

## How you can try it

Three commands on macOS, then a four-line MCP config:

```bash
brew install ollama poppler
ollama serve &
ollama pull nomic-embed-text
cargo install ucp-local
ucp-local index ~/Documents/notes ~/code/my-project
```

Then add UCP to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ucp-local": { "command": "/full/path/to/ucp-local", "args": ["serve"] }
  }
}
```

Restart Claude Desktop. Ask it something grounded in your indexed folders. The reply will cite the files.

If you want the conversation-memory unlock too, export your Claude history from `claude.ai/settings/data-privacy-controls` and run `ucp-local ingest-conversations ~/Downloads/claude-export/conversations.json`. Every future Claude session now has access to every past one. That, more than anything else UCP does, is the part I didn't realise I wanted until I had it.

The full README, MCP configs for Cursor and LM Studio, and the positioning doc are all on [GitHub](https://github.com/akshay2211/universal-context-pipeline). v0.1 is on [crates.io](https://crates.io/crates/ucp-local) as `ucp-local`.

<aside class="repo-star-cta">
  <div class="repo-star-cta-text">
    <p class="eyebrow">Found this useful?</p>
    <p>If <strong>UCP</strong> ends up grounding your Claude or Cursor sessions, a star on GitHub is the easiest way to say thanks — and it helps other folks in privacy-sensitive workflows find it.</p>
  </div>
  <a class="repo-star-button" href="https://github.com/akshay2211/universal-context-pipeline" target="_blank" rel="noopener" aria-label="Star universal-context-pipeline on GitHub">
    <span class="repo-star-button-action">
      <svg class="gh-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      <svg class="star-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
      Star
    </span>
    <span class="repo-star-button-repo">akshay2211/universal-context-pipeline</span>
  </a>
</aside>
