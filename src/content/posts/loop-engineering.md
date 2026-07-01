---
title: "Loop engineering"
pubDatetime: 2026-07-01T09:00:00.000Z
description: "SEED — When prompting moves out of human hands and into another agent driving the loop, the thing you're engineering is no longer the prompt. It's the loop: its signals, its guardrails, and where the human still sits."
draft: true
kind: essay
tags: ["ai-assisted-coding", "coding-agents", "agentic-architecture", "ai-best-practices"]
series: agentic-engineering
seriesOrder: 6
---

<!-- SEED — Luisa's post to write. Outline/scaffold only, in note form; the prose
     is hers. Angle + spine below; delete this comment and write it out, then
     flip draft: false. -->

## The angle

Prompt engineering was the craft when a human sat in the loop typing each turn.
That's ending. The ["engineering loop"](https://x.com/steipete/status/2063697162748260627)
(Peter Steinberger's term) is where prompting moves out of human hands and into
*another agent* that drives the loop. Once that happens, the unit of craft is no
longer the prompt. It's the loop itself.

## Spine (to write)

- **What changed.** Human-in-every-turn → agent-drives-the-loop. The human moves
  from *operator* to *loop designer*.
- **What you're actually engineering now:**
  - **Signal** — the loop is only as good as what it can observe (tests, types,
    lint, runtime errors). Tie back to [slower loops, stronger
    signal](/notes/slower-loops-stronger-signal/): fast loops with weak signal
    just converge faster on the wrong thing.
  - **Guardrails** — an autonomous loop amplifies blast radius. Where do the
    deterministic stops live? (Link the secure-by-design work.)
  - **The human's seat** — not "in every turn," but where? Checkpoints,
    approval gates, the read→propose→approve→execute pattern.
  - **Termination / drift** — when does the loop know it's done vs. spinning?
- **The claim.** Loop engineering is the successor discipline to prompt
  engineering. The leverage moved up a level.

## Open questions / notes

- Does this belong in `agentic-engineering` (craft) or does the security amplification
  angle pull it toward `secure-by-design`? Currently filed craft.
- Concrete example from your own stack (letai orchestrator? the publishing loop?).
